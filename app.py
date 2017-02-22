#!/usr/bin/python

from flask import Flask, render_template, json, request
import MySQLdb
import _mysql

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

db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
cursor=db.cursor()



@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

@app.route('/test', methods=['GET'])
def get_order():
    try:
        db.query("""SELECT * FROM orders""")
        results=db.store_result()
        r=results.fetch_row()
        for row in r:
            print row[0]


    except Exception as e:
        return json.dumps({'error':str(e)})
    finally:
        return db.close()

@app.route('/createOrder/<cat>/<siz>/<fin>', methods=['POST','GET'])
def get_by_category(cat,siz,fin):
    try:
        cursor.execute("INSERT INTO orders (`category`,`size`,`finish`) VALUES (%s,%s,%s), (cat,siz,fin)")
        db.commit()

        return json.dumps({'success':str('you did it')})


    except Exception as e:
        return json.dumps({'error':str(e)})
    
    finally:
        cursor.close()
        db.close()



if __name__ == '__main__':
  app.run(host='0.0.0.0')
