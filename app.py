#!/usr/bin/python

from flask import Flask, jsonify, MySQL, generate_password_hash, check_password_hash
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

if __name__ == '__main__':
  app.run(host='0.0.0.0')
