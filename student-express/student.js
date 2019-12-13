var fs = require('fs')

/** 
 * 数据操作文件，职责：操作文件中的数据，只处理数据，不关心业务
 */
var dbPath = './db.json'

/** 
 * 获取所有学生列表
 * return []
 */
exports.find = function(callback) {
        //把读取的文件按照utf-8编码,
        fs.readFile(dbPath, 'utf-8', function(err, data) {
            if (err) {
                return callback(err)
            } else {
                callback(null, JSON.parse(data).students)
            }
        })
    }
    /** 
     * 根据id获取学生对象
     * @param {Number} id 学生id
     * @param {Function} callback 回调函数
     */
exports.findById = function(id, callback) {
        fs.readFile(dbPath, 'utf-8', function(err, data) {
            if (err) {
                return callback(err)
            }
            var students = JSON.parse(data).students
                // es6的数组方法
            var stu = students.find(function(item) {
                return item.id === id
            })
            callback(null, stu)
        })
    }
    /** 
     * 添加保存学生
     */
exports.save = function(student, callback) {
    fs.readFile(dbPath, 'utf-8', function(err, data) {
        if (err) {
            return callback(err)
        } else {
            var students = JSON.parse(data).students
            student.id = students[students.length - 1].id + 1
            students.push(student)

            var fileData = JSON.stringify({
                students: students
            })
            fs.writeFile(dbPath, fileData, function(err) {
                if (err) {
                    //错误就把错误对象传递给它
                    return callback(err)
                }
                //成功就没错，所以错误对象是null
                callback(null)
            })
        }
    })
}

/** 
 * 更新学生
 */
exports.updateById = function(student, callback) {
    fs.readFile(dbPath, 'utf-8', function(err, data) {
        if (err) {
            return callback(err)
        } else {
            var students = JSON.parse(data).students
                //把id统一为数字
            student.id = parseInt(student.id)
                // es6的数组方法

            var stu = students.find(function(item) {
                    return (item.id === student.id)
                })
                //遍历拷贝对象
            for (var key in student) {
                stu[key] = student[key]
            }
            var fileData = JSON.stringify({
                students: students
            })
            fs.writeFile(dbPath, fileData, function(err) {
                if (err) {
                    //错误就把错误对象传递给它
                    return callback(err)
                }
                //成功就没错，所以错误对象是null
                callback(null)
            })
        }
    })
}

/** 
 * 删除学生
 */
exports.deleteById = function(id, callback) {
    fs.readFile(dbPath, 'utf-8', function(err, data) {
        if (err) {
            return callback(err)
        } else {
            var students = JSON.parse(data).students
                //删除指定id的学生
            students = students.filter(function(item) {
                return (item.id !== parseInt(id))
            })
            var fileData = JSON.stringify({
                students: students
            })
            fs.writeFile(dbPath, fileData, function(err) {
                if (err) {
                    //错误就把错误对象传递给它
                    return callback(err)
                }
                //成功就没错，所以错误对象是null
                callback(null)
            })
        }
    })
}