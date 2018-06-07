#!/usr/bin/env node

var fs = require('fs');
var packer = require('./packer');
var Packer = packer.packer;

fs.readFile(process.argv[2], 'utf-8', function(err, data1) {
    if (err) {
        console.log(err);
    } else {
        fs.readFile(process.argv[3], 'utf-8', function(err, data2) {
            var packer = new Packer;
            optdata = packer.pack(data1 + data2);
            fs.writeFile(process.argv[4], optdata, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("file writes sucess!!")
                }
            })
        });
    }
});