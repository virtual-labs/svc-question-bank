import firebase_admin
from firebase_admin import credentials, auth
from flask import Flask, request, jsonify
# Initialize Firebase Admin SDK
cred = credentials.Certificate('./my_firebase.json')
firebase_admin.initialize_app(cred)



app = Flask(__name__)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    # print(password)

    try:
        user = auth.get_user_by_email(email)
        print(user)
        if user.email_verified and auth.verify_password(password, user.password_hash):
            # Login successful
            return jsonify({'message': 'Login successful'}), 200
        else:
            # Invalid credentials
            return jsonify({'error': 'Invalid email or password'}), 401
    except auth.AuthError as e:
        # Firebase Auth error
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)




