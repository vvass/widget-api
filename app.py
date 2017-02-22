#!/usr/bin/python

from flask import Flask, render_template, json, request
import MySQLdb
import _mysql
from widgets import test
from routes import get_main, widget_view

app = Flask(__name__, static_url_path='')

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

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

# TEMAPLATES

@app.route('/enter', methods=['GET'])
def get_main():
    return send_from_directory('templates', 'index.html')

@app.route('/widgetView', methods=['GET'])
def widget_view():
    return send_from_directory('templates', 'widget-view.html')





# APIs

@app.route('/deleteWidget/<order>', methods=['DELETE'])
def delete_widget(order):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=order)

    query = """DELETE FROM `orders` WHERE id=%(_id)s"""

    try:

        cursor.execute(query,param)
        db.commit()

        return json.dumps({'success':str('you deleted it')})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/incCount/<orderId>', methods=['POST','GET'])
def inc_order(orderId):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=orderId)

    query = """update orders, (SELECT count as prevCount FROM orders WHERE id=%(_id)s) as t2 set count=t2.prevCount+1 where id=%(_id)s;"""


    try:

        cursor.execute(query,param)
        db.commit()

        return json.dumps({'success':str('you incremented it')})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/getAvalQuantity/<id>', methods=['POST','GET'])
def get_avalable_quantity(id):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=id)

    query = """SELECT avalQuantity,id FROM orders WHERE id=%(_id)s"""

    try:

        cursor.execute(query,param)
        data=cursor.fetchall()

        return json.dumps({'success':str(data)})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/updateAvalQuantity/<id>/<newValue>', methods=['POST','GET'])
def update_aval_quantity(id,newValue):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=id,_newValue=newValue)

    query = """UPDATE orders SET avalQuantity=%(_newValue)s WHERE id=%(_id)s"""

    try:

        cursor.execute(query,param)
        db.commit()

        return json.dumps({'success':str('you did it')})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/addNewWidget/<cat>/<siz>/<fin>/<count>/<quant>', methods=['POST','GET'])
def add_widget(cat,siz,fin,count,quant):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_cat=cat,_siz=siz,_fin=fin,_count=count,_quant=quant)

    query = """INSERT INTO orders (category,size,finish,count,avalQuantity) VALUES (%(_cat)s,%(_siz)s,%(_fin)s,%(_count)s,%(_quant)s)"""

    try:

        cursor.execute(query,param)
        db.commit()

        return json.dumps({'success':str('you have a new value ')})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/searchBySize/<siz>', methods=['POST','GET'])
def search_by_size(siz):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_size=siz)

    query = """SELECT * FROM orders WHERE size=%(_size)s"""

    try:

        cursor.execute(query,param)
        data=cursor.fetchall()

        return json.dumps({'success':str(data)})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/searchByFinish/<fin>', methods=['POST','GET'])
def search_by_finish(fin):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_fin=fin)

    query = """SELECT * FROM orders WHERE finish=%(_fin)s"""

    try:

        cursor.execute(query,param)
        data=cursor.fetchall()

        return json.dumps({'success':str(test())})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/searchByCategory/<cat>', methods=['POST','GET'])
def search_by_category(cat):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_cat=cat)

    query = """SELECT * FROM orders WHERE categroy=%(_cat)s"""

    try:

        cursor.execute(query,param)
        data=cursor.fetchall()

        return json.dumps({'success':str(data)})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()


if __name__ == '__main__':
  app.run(host='0.0.0.0')
