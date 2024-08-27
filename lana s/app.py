from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_mail import Mail, Message
from twilio.rest import Client
from dotenv import load_dotenv
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder

from flask_migrate import Migrate

import google.generativeai as genai

app = Flask(__name__)
CORS(app)

load_dotenv()

# Configuración de la base de datos

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.environ.get('MYSQL_USER')}:{os.environ.get('MYSQL_PASSWORD')}@{os.environ.get('MYSQL_HOST')}/{os.environ.get('MYSQL_DB')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuración de Flask-Mail

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASS')

# Configuración de JWT

app.config['JWT_SECRET_KEY'] = 'super-secret-key'

# Configuración de Gemini

gemini_key = os.environ.get('GEMINI_API_KEY')
genai.configure(api_key = gemini_key)
model = genai.GenerativeModel('gemini-pro')

# Inicializar extensiones

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app,db)
jwt = JWTManager(app)
mail = Mail(app)

# Configuración de Twilio

twilio_sid = os.environ.get('TWILIO_SID')
twilio_token = os.environ.get('TWILIO_TOKEN')
twilio_client = Client(twilio_sid, twilio_token)

# Modelo de usuario

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(80), unique = True, nullable = False)
    email = db.Column(db.String(120), unique = True, nullable = False)
    phone = db.Column(db.String(9), unique = True,  nullable = False)
    password = db.Column(db.String(120), nullable = False)

# Crear la base de datos

with app.app_context():
    db.create_all()

# Registro de usuario

@app.route('/register', methods = ['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username = data['username'], email = data['email'], phone = data['phone'], password = hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Usuario registrado'})

# Inicio de sesión

@app.route('/login', methods = ['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username = data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity = {'username': user.username, 'email': user.email})
        return jsonify({ 'username': user.username, 'email': user.email, 'phone': user.phone, 'token': access_token})
    return jsonify({'message': 'Credenciales incorrectas'}), 401

# Enviar correo electrónico

@app.route('/send_email', methods = ['POST'])
@jwt_required()
def send_email():
    data = request.get_json()
    msg = Message(data['subject'],
                  sender = os.environ.get('EMAIL_USER'),
                  recipients = [data['to']])
    msg.body = data['message']
    mail.send(msg)
    return jsonify({'message': 'Correo enviado'})

# Enviar mensaje de WhatsApp
@app.route('/send_whatsapp', methods = ['POST'])
@jwt_required()
def send_whatsapp():
    try:
        data = request.get_json()
        message = twilio_client.messages.create(
            body = data['message'],
            from_ = 'whatsapp:+14155238886',
            to = f"whatsapp:+51{data['to']}"
        )
        return jsonify({'message': 'Mensaje de WhatsApp enviado'})
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/')
def home():
    return "Lana S"

# OBJ1

province_model = joblib.load('OBJ1/province_model.pkl')
district_model = joblib.load('OBJ1/district_model.pkl')
region_model = joblib.load('OBJ1/region_model.pkl')

province_map = {
    0: 'ALTO AMAZONAS',
    1: 'CHANCHAMAYO',
    2: 'CORONEL PORTILLO',
    3: 'JAEN',
    4: 'MAYNAS',
    5: 'MORROPON',
    6: 'PIURA',
    7: 'SATIPO',
    8: 'SULLANA',
    9: 'TALARA',
    10: 'TAMBOPATA',
    11: 'TRUJILLO',
    12: 'TUMBES',
    13: 'ZARUMILLA'
}

district_map = {
    0: 'AGUAS VERDES',
    1: 'BELEN',
    2: 'BELLAVISTA',
    3: 'BUENOS AIRES',
    4: 'CALLERIA',
    5: 'CAMPOVERDE',
    6: 'CASTILLA',
    7: 'CATACAOS',
    8: 'CHANCHAMAYO',
    9: 'CHULUCANAS',
    10: 'CORRALES',
    11: 'CURA MORI',
    12: 'EL PORVENIR',
    13: 'FERNANDO LORES',
    14: 'FLORENCIA DE MORA',
    15: 'HUANCHACO',
    16: 'INAMBARI',
    17: 'IQUITOS',
    18: 'JAEN',
    19: 'LA ARENA',
    20: 'LA CRUZ',
    21: 'LA ESPERANZA',
    22: 'LA MATANZA',
    23: 'LA UNION',
    24: 'LABERINTO',
    25: 'LAREDO',
    26: 'LAS LOMAS',
    27: 'LAS PIEDRAS',
    28: 'LOS ORGANOS',
    29: 'MANANTAY',
    30: 'MANCORA',
    31: 'MARCAVELICA',
    32: 'MAZAMARI',
    33: 'MIGUEL CHECA',
    34: 'MORROPON',
    35: 'PAMPAS DE HOSPITAL',
    36: 'PANGOA',
    37: 'PAPAYAL',
    38: 'PARIÑAS',
    39: 'PERENE',
    40: 'PICHANAQUI',
    41: 'PIURA',
    42: 'PUNCHANA',
    43: 'QUERECOTILLO',
    44: 'RIO NEGRO',
    45: 'SALITRAL',
    46: 'SAN JACINTO',
    47: 'SAN JUAN BAUTISTA',
    48: 'SAN JUAN DE BIGOTE',
    49: 'SAN JUAN DE LA VIRGEN',
    50: 'SAN RAMON',
    51: 'SATIPO',
    52: 'SULLANA',
    53: 'TAMBO GRANDE',
    54: 'TAMBOPATA',
    55: 'TRUJILLO',
    56: 'TUMBES',
    57: 'VEINTISEIS DE OCTUBRE',
    58: 'YARINACOCHA',
    59: 'YURIMAGUAS',
    60: 'ZARUMILLA'
}

region_map = {
    0: 'CAJAMARCA',
    1: 'JUNIN',
    2: 'LA LIBERTAD',
    3: 'LORETO',
    4: 'MADRE DE DIOS',
    5: 'PIURA',
    6: 'TUMBES',
    7: 'UCAYALI'
}

@app.route('/predict', methods=['POST'])
def predict():
    try: 
        data = request.json

        new_data = pd.DataFrame(data)
        X_new_data = new_data[['edad', 'sexo', 'enfermedad', 'mes']].values

        province_prediction = province_model.predict(X_new_data)
        district_prediction = district_model.predict(X_new_data)
        region_prediction = region_model.predict(X_new_data)

        provincial_name_prediction = [province_map[p] for p in province_prediction]
        district_name_prediction = [district_map[d] for d in district_prediction]
        regional_name_prediction = [region_map[r] for r in region_prediction]

        interpretation = model.generate_content(f"En menos de 128 palabras y según los resultados, ¿qué sitios recomiendas evitar visitar y qué recomendaciones recomiendas tomar para no contagiarme de dengue en este lugar?: Provincia - {provincial_name_prediction}; Distrito - {district_name_prediction}; Region - {regional_name_prediction}: Datos - {data}.")

        return jsonify({
            "region": regional_name_prediction,
            "province": provincial_name_prediction,
            "district": district_name_prediction,
            "interpretation": interpretation.text
        })
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

# OBJ2

model1 = joblib.load('OBJ2/model.pkl')

@app.route('/predict1', methods=['POST'])
def predict1():
    try:
        data = request.get_json

        new_case = pd.DataFrame([data])

        new_case = new_case.reindex(columns=['year', 'weekofyear', 'ndvi_ne', 'ndvi_nw', 'ndvi_se', 'ndvi_sw',
                                             'precipitation_amt_mm', 'reanalysis_air_temp_k', 'station_avg_temp_c',
                                             'reanalysis_relative_humidity_percent', 'station_precip_mm'], fill_value=0)

        prediction = model1.predict(new_case)

        interpretation = model.generate_content(f"En menos de 128 palabras y según los resultados, ¿qué plan de contingencia de debería aplicar para combatir el dengue?: Número de casos - {prediction[0]}; Datos - {data}")

        return jsonify({'result': prediction[0], 'interpretation': interpretation.text})
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

# OBJ3

model2 = joblib.load('OBJ3/model.pkl')
class_map = {0: 'Negativo', 1: 'Positivo'}

@app.route('/predict2', methods=['POST'])
def predict2(): 
    try:
        data = request.get_json()

        input_data = pd.DataFrame([data])

        expected_columns = model2.feature_names_in_
        input_data = input_data[expected_columns]

        prediction = model2.predict(input_data)
        probability = model2.predict_proba(input_data)

        result = class_map.get(prediction[0], 'Desconocido')
        probability_dengue = probability[0][1]

        interpretation = model.generate_content(f"En menos de 128 palabras y según los resultados, ¿qué enfermedad puedo tener y qué tratamiento puedo seguir?: Probabilidad de dengue - {result} ({probability_dengue}); Sintomas - {data}.")

        return jsonify({
            'result': result,
            'probability_dengue': probability_dengue,
            'interpretation': interpretation.text
        })

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

# python app.py