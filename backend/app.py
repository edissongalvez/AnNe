from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)

# Cargar el modelo y el escalador (OBJ2)
model = joblib.load('OBJ2/model.pkl')
scaler = joblib.load('OBJ2/scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # Verificar si todas las claves están presentes
        required_keys = ['ano', 'semana', 'densidad_poblacion', 'temperatura', 'precipitaciones', 'humedad', 'tasa_urbanizacion', 'presencia_aguas_estancadas']
        if not all(key in data for key in required_keys):
            return jsonify({'error': 'Faltan datos en la solicitud'}), 400
        
        # Convertir los datos a un formato numpy array
        input_features = np.array([
            data['ano'], data['semana'], data['densidad_poblacion'], data['temperatura'],
            data['precipitaciones'], data['humedad'],
            data['tasa_urbanizacion'], data['presencia_aguas_estancadas']
        ]).reshape(1, -1)

        # Convertir características categóricas usando LabelEncoder
        diagnostic_le = LabelEncoder()
        presence_le = LabelEncoder()

        # Aquí deberías entrenar los LabelEncoders con datos de ejemplo o usar los entrenados
        # input_features[:, 4] = diagnostic_le.fit_transform(input_features[:, 4])
        input_features[:, 7] = presence_le.fit_transform(input_features[:, 7])

        # Asegúrate de que input_features tenga el mismo número de características que el escalador
        if input_features.shape[1] != scaler.n_features_in_:
            return jsonify({'error': 'Número de características no coincide'}), 400

        # Escalar características
        input_features = scaler.transform(input_features)

        # Hacer la predicción
        prediction = model.predict(input_features)
        return jsonify({'prediction': float(prediction[0])})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Cargar el modelo (OBJ3)
model1 = joblib.load('OBJ3/model.pkl')
scaler1 = joblib.load('OBJ3/scaler.pkl')

@app.route('/predict1', methods=['POST'])
def predict1(): 
    try:
        data = request.json

        # Verificar si todas las claves están presentes
        required_keys = ['eyepain', 'fever', 'nausea', 'headache', 'vomiting', 'jointpain', 'loss_appet', 'musclepain', 'diarrhea', 'darkurine', 'jaundice', 'abdominal', 'bleeding']
        if not all(key in data for key in required_keys):
            return jsonify({'error': 'Faltan datos en la solicitud'}), 400

        # Convertir los datos a un formato DataFrame
        input_features = pd.DataFrame([data])

        # Convertir características categóricas usando LabelEncoders
        for column in input_features.columns:
            le = scaler1[column]
            input_features[column] = le.transform(input_features[column])

        # Hacer la predicción
        prediction = model1.predict(input_features)
        return jsonify({'prediction': int(prediction[0])})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


# python app.py