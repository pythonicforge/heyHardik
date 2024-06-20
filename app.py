from flask import Flask
from config import Config
from routes import main_bp

app = Flask(__name__, static_folder='static')
app.config.from_object(Config)

app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run()