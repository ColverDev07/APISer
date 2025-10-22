import os
import time
import requests
import logging
from flask import Flask, session, request, redirect, render_template, jsonify, send_from_directory
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import google.generativeai as genai

# --- Configuración Inicial ---
load_dotenv()
logging.basicConfig(level=logging.INFO) # Cambiado a INFO para menos verbosidad

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')
# Secreto para la sesión de Flask (Spotify la necesita)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', os.urandom(24))

# --- Configuración de API de Google (Película Mental) ---
try:
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    genai.configure(api_key=GOOGLE_API_KEY)
    if not GOOGLE_API_KEY:
        app.logger.warning("ADVERTENCIA: Falta GOOGLE_API_KEY.")
except Exception as e:
    app.logger.error(f"Error config IA: {e}")

# --- Configuración de API de Spotify ---
SCOPE = "streaming user-read-playback-state user-modify-playback-state user-read-private user-read-email user-read-currently-playing"
try:
    # Asegúrate de que las variables de entorno existan
    client_id = os.getenv("SPOTIPY_CLIENT_ID")
    client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
    redirect_uri = os.getenv("SPOTIPY_REDIRECT_URI")

    if not (client_id and client_secret and redirect_uri):
        app.logger.warning("ADVERTENCIA: Faltan variables de Spotify (CLIENT_ID, CLIENT_SECRET, REDIRECT_URI).")
        sp_oauth = None # Marcar como no configurado
    else:
        sp_oauth = SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope=SCOPE,
            cache_path=".spotify_cache", # Guardará el token caché aquí
            show_dialog=False # No mostrar diálogo de autorización cada vez
        )
except Exception as e:
     app.logger.error(f"Error config SpotifyOAuth: {e}")
     sp_oauth = None

# --- Funciones de Ayuda (Spotify) ---
def get_spotify_client():
    """Obtiene un cliente de Spotipy autenticado y refresca el token si es necesario."""
    if not sp_oauth: # Si la configuración inicial falló
        return None, None

    token_info = session.get('token_info', None)
    if not token_info:
        app.logger.info("No hay token en la sesión")
        return None, None

    now = int(time.time())
    # Usamos .get() para evitar errores si la llave no existe
    expires_at = token_info.get('expires_at', 0)
    is_expired = expires_at - now < 60 # Refrescar si falta menos de 1 min

    if is_expired:
        app.logger.info("Token expirado, refrescando...")
        try:
            # Pasa el refresh_token explícitamente
            refresh_token = token_info.get('refresh_token')
            if not refresh_token:
                 app.logger.warning("No hay refresh_token para refrescar. Limpiando sesión.")
                 session.clear()
                 return None, None
            token_info = sp_oauth.refresh_access_token(refresh_token)
            session['token_info'] = token_info
            app.logger.info("Token refrescado y guardado en sesión.")
        except Exception as e:
            app.logger.error(f"Error al refrescar token: {e}. Limpiando sesión.")
            session.clear() # Limpia la sesión si el refresh token es inválido
            return None, None

    # Usa .get() para el access_token
    access_token = token_info.get('access_token')
    if not access_token:
        app.logger.warning("Token_info no contiene access_token.")
        return None, None

    sp = spotipy.Spotify(auth=access_token)
    return sp, token_info

# ==================================================
# RUTAS DE LA APP "PELÍCULA MENTAL"
# ==================================================
@app.route('/')
def index():
    """Sirve la página principal (Película Mental)."""
    token_info = session.get('token_info', None)
    # Pasamos el estado del login al template para que JS lo lea
    return render_template('index.html', is_spotify_logged_in=bool(token_info))

@app.route('/<path:filename>')
def serve_static(filename):
    """Sirve app.js (y cualquier otro archivo) desde la carpeta 'static'."""
    # Asegurarse que solo sirva archivos conocidos si es necesario
    # Por ahora, sirve cualquier cosa de 'static'
    return send_from_directory(app.static_folder, filename)

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    """API para generar imágenes (IA)."""
    app.logger.info("Petición /api/generate-image")
    if not GOOGLE_API_KEY:
         return jsonify({"error": "Google API Key no configurada."}), 500
    try:
        data = request.get_json()
        user_prompt = data.get('prompt')
        if not user_prompt: return jsonify({"error": "No prompt."}), 400

        headers = { 'Content-Type': 'application/json' }
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key={GOOGLE_API_KEY}"
        request_body = {
            "instances": { "prompt": user_prompt },
            "parameters": { "sampleCount": 1 }
        }

        response = requests.post(api_url, headers=headers, json=request_body)
        response.raise_for_status() # Lanza excepción si hay error HTTP
        response_data = response.json()

        # Verificar la estructura de la respuesta
        if 'predictions' not in response_data or not response_data['predictions']:
             app.logger.error(f"Respuesta inesperada de API Imagen: {response_data}")
             return jsonify({"error": "Respuesta inesperada de API Imagen."}), 500

        base64_image = response_data['predictions'][0].get('bytesBase64Encoded')
        if not base64_image:
             app.logger.error(f"No se encontró 'bytesBase64Encoded' en la respuesta: {response_data}")
             return jsonify({"error": "No se encontró imagen en la respuesta."}), 500

        image_url = f"data:image/png;base64,{base64_image}"
        return jsonify({"imageUrl": image_url})

    except requests.exceptions.RequestException as req_err:
        app.logger.error(f"Error de red llamando a API Imagen: {req_err}")
        return jsonify({"error": f"Error de red: {req_err}"}), 503 # Service Unavailable
    except Exception as e:
        app.logger.error(f"Error en /api/generate-image: {e}", exc_info=True) # Log completo del error
        return jsonify({"error": f"Error interno del servidor."}), 500

@app.route('/api/generate-text', methods=['POST'])
def generate_text():
    """API para generar texto (IA)."""
    app.logger.info("Petición /api/generate-text")
    if not GOOGLE_API_KEY:
         return jsonify({"error": "Google API Key no configurada."}), 500
    try:
        data = request.get_json()
        answers = data.get('answers', [])
        if not answers: return jsonify({"error": "No answers."}), 400

        full_prompt = (
            "Eres un coach motivacional y guionista de cine. "
            "Basado en las siguientes respuestas de un cuestionario de 'proyecto de vida', "
            "genera una frase inspiradora, corta y poderosa (máximo 15 palabras) "
            "para el final de la 'película' de este usuario:\n\n"
        )
        # Asegurarse que solo se añaden strings al prompt
        valid_answers = [item.get('answer', '') for item in answers if isinstance(item, dict) and item.get('answer')]
        full_prompt += "\n".join(f"- {ans}" for ans in valid_answers)

        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(full_prompt)
        # Acceder al texto de forma segura
        generated_text = response.text if hasattr(response, 'text') else "No se pudo generar texto."

        return jsonify({"generatedText": generated_text.strip().replace('"', '')})
    except Exception as e:
        app.logger.error(f"Error en /api/generate-text: {e}", exc_info=True)
        return jsonify({"error": f"Error interno del servidor."}), 500

# ==================================================
# RUTAS DE AUTENTICACIÓN Y API DE SPOTIFY
# ==================================================
@app.route('/login')
def login():
    """Redirige al login de Spotify."""
    if not sp_oauth:
        return "Error: Configuración de Spotify no está completa.", 500
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/callback')
def callback():
    """Maneja el callback de Spotify."""
    if not sp_oauth:
        return "Error: Configuración de Spotify no está completa.", 500

    session.clear() # Limpia sesión anterior por seguridad
    code = request.args.get('code')
    error = request.args.get('error')

    if error:
        app.logger.error(f"Error en callback de Spotify: {error}")
        return redirect('/?error=' + error) # Redirigir con error

    if not code:
         app.logger.error("No se recibió código en callback.")
         return redirect('/?error=no_code')

    try:
        token_info = sp_oauth.get_access_token(code, check_cache=False) # Forzar petición nueva
        # Guardar solo lo necesario y asegurar 'expires_at'
        session['token_info'] = {
            'access_token': token_info['access_token'],
            'refresh_token': token_info['refresh_token'],
            'expires_at': token_info['expires_at']
        }
        app.logger.info("Token obtenido y guardado en sesión.")
    except Exception as e:
        app.logger.error(f"Error al obtener token en callback: {e}", exc_info=True)
        return redirect('/?error=token_error') # Redirigir con error

    return redirect('/') # Redirige a la página principal

@app.route('/logout')
def logout():
    """Borra la sesión de Spotify."""
    session.clear()
    app.logger.info("Sesión de Spotify borrada.")
    # Opcional: Redirigir a una página de logout de Spotify si existe
    # o simplemente a la página principal.
    return redirect('/')

@app.route('/api/token')
def api_token():
    """Provee el token al frontend (para el SDK Web)."""
    sp, token_info = get_spotify_client() # Refresca si es necesario
    if not token_info:
        return jsonify({'error': 'No autenticado'}), 401
    access_token = token_info.get('access_token')
    if not access_token:
         return jsonify({'error': 'Token inválido en sesión'}), 401
    return jsonify({'access_token': access_token})

@app.route('/api/transfer_playback', methods=['POST'])
def transfer_playback():
    """(¡LA RUTA QUE FALTABA!) Transfiere el playback al navegador."""
    sp, token_info = get_spotify_client()
    if not token_info: return jsonify({'error': 'No autenticado'}), 401
    try:
        device_id = request.json.get('device_id')
        if not device_id: return jsonify({'error': 'device_id requerido'}), 400
        app.logger.info(f"Transfiriendo playback a: {device_id}")
        sp.transfer_playback(device_id=device_id, force_play=True) # force_play=True inicia/resume
        return jsonify({'status': 'success'})
    except spotipy.exceptions.SpotifyException as sp_err:
         # Errores comunes: 404 (device not found), 403 (restricted device)
         app.logger.error(f"Error de Spotify al transferir: {sp_err}")
         return jsonify({'error': f'Spotify error: {sp_err.msg}'}), sp_err.http_status
    except Exception as e:
        app.logger.error(f"Error al transferir reproducción: {e}", exc_info=True)
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route('/api/search', methods=['POST'])
def api_search():
    """Busca canciones en Spotify."""
    sp, token_info = get_spotify_client()
    if not token_info: return jsonify({'error': 'No autenticado'}), 401
    try:
        query = request.json.get('query')
        if not query or len(query) < 2: # Evitar búsquedas vacías o muy cortas
             return jsonify({'error': 'Query requerida (min 2 chars)'}), 400

        app.logger.info(f"Buscando: {query}")
        results = sp.search(q=query, type='track', limit=10) # Limita a 10 resultados
        tracks = results.get('tracks', {}).get('items', [])
        return jsonify(tracks)
    except spotipy.exceptions.SpotifyException as sp_err:
        app.logger.error(f"Error de Spotify en búsqueda: {sp_err}")
        return jsonify({'error': f'Spotify error: {sp_err.msg}'}), sp_err.http_status
    except Exception as e:
        app.logger.error(f"Error en búsqueda: {e}", exc_info=True)
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route('/api/play', methods=['POST'])
def api_play():
    """Reproduce una canción (URI) en el dispositivo activo."""
    sp, token_info = get_spotify_client()
    if not token_info: return jsonify({'error': 'No autenticado'}), 401
    try:
        track_uri = request.json.get('track_uri')
        if not track_uri: return jsonify({'error': 'track_uri requerido'}), 400
        app.logger.info(f"Reproduciendo: {track_uri}")
        sp.start_playback(uris=[track_uri]) # Reproduce en el dispositivo activo
        return jsonify({'status': 'success'})
    except spotipy.exceptions.SpotifyException as sp_err:
         # Error común: 404 (No active device found) si el SDK web no está listo
         app.logger.error(f"Error de Spotify en reproducción: {sp_err}")
         if sp_err.http_status == 404:
              return jsonify({'error': 'No hay dispositivo activo. Asegúrate que el reproductor web esté listo.'}), 404
         else:
              return jsonify({'error': f'Spotify error: {sp_err.msg}'}), sp_err.http_status
    except Exception as e:
        app.logger.error(f"Error en reproducción: {e}", exc_info=True)
        return jsonify({'error': 'Error interno del servidor'}), 500

# --- Punto de entrada ---
if __name__ == '__main__':
    is_debug = os.environ.get('FLASK_DEBUG', '0').lower() in ['true', '1', 't']
    # Puerto 5000 por defecto, como pediste
    port = int(os.environ.get('PORT', 5000))
    # Host 127.0.0.1 por defecto, como pediste
    host = '127.0.0.1'
    print(f" ----- Iniciando Película Mental con Spotify ----- ")
    print(f" URL: http://{host}:{port}")
    print(f" Modo Debug: {is_debug}")
    print(f" {'='*40}")
    # Desactivar reloader si no estás en modo debug para evitar doble inicialización
    app.run(debug=is_debug, host=host, port=port, use_reloader=is_debug)