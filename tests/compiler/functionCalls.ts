﻿///<reference path='..\..\compiler\typescript.ts' />
///<reference path='..\..\harness\harness.ts' />

describe('Compiling tests\\compiler\\functionCalls.ts', function() {
    describe('Function Call Tests', function() {
        var typeFactory = new Harness.Compiler.TypeFactory();
    
        describe('Testing just the return types', function() {
            it("Return type void", function() {
                // TODO
                //var voidType = typeFactory.get("function f0(){};", "f0");
                //WScript.Echo(voidType.type);
            });
            it("Return type any", function() {
                var voidType = typeFactory.get('function foo():any{return ""}; var x = foo();', "x");
            
                assert.equal(voidType.type, "any");
            });
            it("Return type number", function() {
                var voidType = typeFactory.get('function foo():number{return 1}; var x = foo();', "x");
            
                assert.equal(voidType.type, "number");
            });
            it("Return type object", function() {
                // TODO
                //var voidType = typeFactory.get('function foo():number{return 1}; var x = foo();', "x");
                //assert.equal(voidType.type, "number");
            });
            it("Return type array", function() {
                var voidType = typeFactory.get('function foo():any[]{return new number[]}; var x = foo();', "x");
            
                assert.equal(voidType.type, "any[]");
            });
            it("Return type function that returns any", function() {
                var voidType = typeFactory.get('function foo():any{return ""}; function bar():()=>any{return foo}; var x = bar();', "x");
            
                assert.equal(voidType.type, "() => any");
            });
            it("Return type class in a module", function() {
                var code = "module m1 { export class c1 { public a; }} ";
                code += "function foo():m1.c1{return new m1.c1();}; ";
                code += "var x = foo();";
            
                var voidType = typeFactory.get(code, "x");
                
                assert.equal(voidType.type, "c1");
            });
        });
        describe('Testing just the parameters', function() {
            it("Check for single param", function() {
                var code = "function foo(a:string){}; ";
                code += "foo('bar'); ";
                code += "foo(2);" ;
                code += "foo('foo', 'bar');" ;
                code += "foo();" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 3);
                });
            });
        
            it("Check for single obj", function() {
                var code = "function foo(a:{b:number; c:string;}){}; ";
                code += "foo({b:1, c:'bar'}); ";
                code += "foo({});" ;
                code += "foo(4);" ;
                code += "foo();" ;
                code += "foo({}, {});" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 4);
                });
            });
        
            it("Check for class in module", function() {
                var code = "module m1 { export class c1 { public a; }} ";
                code += "function foo(a:m1.c1){ a.a = 1; }; ";
                code += "var myC = new m1.c1(); ";
                code += "foo(myC); ";
                code += "foo(myC, myC); ";
                code += "foo(4);" ;
                code += "foo();" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 3);
                });
            });
        
            it("Check for optional param", function() {
                var code = "function foo(a?:string){} ";
                 code += "foo('foo'); ";
                code += "foo('foo', 'bar'); ";
                code += "foo(4);" ;
                code += "foo();" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 2);
                });
            });
        
            it("Check for multiple optional param", function() {
                var code = "function foo(a?:string, b?:number){}; ";
                 code += "foo('foo', 1); ";
                code += "foo('foo'); ";
                code += "foo('foo','bar');" ;
                code += "foo('foo', 1, 'bar');" ;
                code += "foo();" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 2);
                });
            });
        
            it("Check for rest param", function() {
                var code = "function foo(...a:number[]){}; ";
                code += "foo(0, 1); ";
                code += "foo('foo'); ";
                code += "foo();" ;
                code += "foo(1, 'bar');" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 2);
                });
            });
        
            it("Check for string and optional param", function() {
                var code = "function foo(a:string, b?:number){} ";
                code += "foo('foo', 1); ";
                code += "foo('foo'); ";
                code += "foo();" ;
                code += "foo(1, 'bar');" ;
                code += "foo('foo', 1, 'bar');" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 3);
                });
            });
        
            it("Check for string and 2 optional param", function() {
                var code = "function foo(a:string, b?:number, c?:string){} ";
                code += "foo('foo', 1); ";
                code += "foo('foo'); ";
                code += "foo();" ;
                code += "foo(1, 'bar');" ;
                code += "foo('foo', 1, 'bar');" ;
                code += "foo('foo', 1, 3);" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 3);
                });
            });
        
            it("Check for string and rest param", function() {
                var code = "function foo(a:string, ...b:number[]){} ";
                code += "foo('foo', 1); ";
                code += "foo('foo'); ";
                code += "foo();" ;
                code += "foo(1, 'bar');" ;
                code += "foo('foo', 1, 3);" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 2);
                });
            });
        
            /* Bug 13083
            it("Check for optional and rest param", function() {
                var code = "function foo(a?:string, ...b:number[]){} ";
                code += "foo('foo', 1); ";
                code += "foo('foo'); ";
                code += "foo();" ;
                code += "foo(1, 'bar');" ;
                code += "foo('foo', 1, 3);" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 1);
                });
            });
        
            it("Check for optional and rest param", function() {
                var code = "function foo(a?:string, b?:number, ...b:number[]){} ";
                code += "foo('foo', 1); ";
                code += "foo('foo'); ";
                code += "foo();" ;
                code += "foo(1, 'bar');" ;
                code += "foo('foo', 1, 3);" ;
                code += "foo('foo', 1, 3, 3);" ;
                code += "foo('foo', 1, 3, 'foo');" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 1);
                });
            });
        
            it("Check for optional and rest param", function() {
                var code = "function f20(a:string, b?:string, ...c:number[]){} ";
                code += "foo('foo', 1); ";
                code += "foo('foo'); ";
                code += "foo('foo', 'bar'); ";
                code += "foo();" ;
                code += "foo(1, 'bar');" ;
                code += "foo('foo', 'bar', 3);" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 2);
                });
            });
        
            it("Check for optional and rest param", function() {
                var code = "function f21(a:string, b?:string, c?:number, ...d:number[]){} ";
                code += "foo('foo', 1); ";
                code += "foo('foo'); ";
                code += "foo();" ;
                code += "foo(1, 'bar');" ;
                code += "foo('foo', 1, 3);" ;
                code += "foo('foo', 'bar', 3, 4);" ;
                Harness.Compiler.compileString(code, 'singleParam', function(result) {          
                    assert.equal(result.errors.length, 1);
                });
            });
            */
        });
    
       
    });
});