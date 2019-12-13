var fs = require('fs')
var express = require('express')
var router = express.Router()
var Student = require('./student')


router.get('/students', (req, res) => {
    Student.find(function(err, students) {
        if (err) {
            return res.status(500).send('Sever error.')
        }
        res.render('index.html', {
            tables: [
                '条形图', '柱状图', '饼图', '折线图'
            ],
            students: students
        })
    })
})
router.get('/students/new', (req, res) => {
    res.render('new.html')
})
router.post('/students/new', (req, res) => {
    // 1.获取表单数据
    // 2.处理，将数据保存到db.json 文件中用以持久化
    // 3.发送响应
    // 新增的 student 信息怎么传给回调函数？作为save函数的参数
    var student = req.body
    Student.save(req.body, function(err) {
        if (err) {
            return res.status(500).send('Sever error.')
        }

        res.redirect('/students')
    })
})
router.get('/students/edit', (req, res) => {
    Student.findById(parseInt(req.query.id), function(err, student) {
        if (err) {
            return res.status(500).send('Sever error.')
        }
        student.checkedMale = ''
        student.checkedFemale = ''
        if (student.gender == 0) {
            student.checkedMale = 'checked'
        } else {
            student.checkedFemale = 'checked'
        }
        res.render('edit.html', {
            student: student
        })
    })

})
router.post('/students/edit', (req, res) => {
    Student.updateById(req.body, function(err) {
        if (err) {
            return res.status(500).send('Sever error.')
        }
        res.redirect('/students')
    })
})
router.get('/students/delete', (req, res) => {
    Student.deleteById(req.query.id, function(err) {
        if (err) {
            return res.status(500).send('Sever error.')
        }
        res.redirect('/students')
    })
})

module.exports = router