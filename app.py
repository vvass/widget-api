#!/usr/bin/python

from flask import Flask, render_template, json, request
from flask_mysql import MySQL
from werkzeug import generate_password_hash, check_password_hash

app = Flask(__name__)

tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]

mysql = MySQL()
 
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '3342e8db85744734794d60c9c797bbcf6c24007d84debbf4'
app.config['MYSQL_DATABASE_DB'] = 'widgets'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)



@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

@app.route('/test', methods=['GET'])
def get_order():
    try:
        conn = mysql.connect()
        cursor = conn.cursor()
        _hashed_password = generate_password_hash('3342e8db85744734794d60c9c797bbcf6c24007d84debbf4')

        cursor.callproc('sp_createUser',('test','vvass@test.com',_hashed_password))

        data = cursor.fetchall()

        if len(data) is 0:
            conn.commit()
            return json.dumps({'message':'User created'})
        else:
            return json.dumps({'error':str(data[0])})


    except Exception as e:
        return json.dumps({'error':str(e)})
    finally:
        cursor.close()
        conn.close()





if __name__ == '__main__':
  app.run(host='0.0.0.0')
