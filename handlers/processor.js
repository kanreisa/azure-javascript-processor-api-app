'use strict';

var vm = require('vm');
var formidable = require('formidable');

module.exports = {
    post: function (req, res) {
        
        var sandbox = {
            result: '',
            code  : 'return "";',
            errors: []
        };
        
        if (req.query.json) {
            try {
                sandbox.json = JSON.parse(req.query.json);
            } catch (e) {
                res.status(400);
                sandbox.errors.push(e.toString());
            }
        }
        
        sandbox.code = req.query.code;
        
        console.log(sandbox);

        var code = 'result = (function () { ' + sandbox.code + ' }());';
        
        try {
            vm.runInNewContext(code, sandbox);
        } catch (e) {
            res.status(400);
            sandbox.errors.push(e.toString());
        }
        
        res.json(sandbox);
    }
};