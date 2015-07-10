//var assert = require("assert")
//import {assert} from 'chai'
import chai from 'chai'
//var chai = require('chai')
//var assert = chai.assert
let assert = chai.assert

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5))
      assert.equal(-1, [1,2,3].indexOf(0))
    })
  })
})


import Rx from 'rx'
let Observable = Rx.Observable
let just = Observable.just

describe('simple subscription', function() {
  it('should do the magic !', function(done) {
    just(42).subscribe(function (x) { assert.equal(x, 42); done()})
  })
})




function createMessage(actual, expected) {
    return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']'
}

// Using QUnit testing for assertions
var collectionAssert = {
    assertEqual: function (expected, actual) {
        var comparer = Rx.internals.isEqual,
            isOk = true;

        if (expected.length !== actual.length) {
            assert.ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length)
            return;
        }

        for(var i = 0, len = expected.length; i < len; i++) {
            isOk = comparer(expected[i], actual[i])
            if (!isOk) {
                break
            }
        }

        assert.ok(isOk, createMessage(expected, actual))
    }
}


var onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;


describe('buffer should join strings', function () {

    var scheduler = new Rx.TestScheduler()

    var input = scheduler.createHotObservable(
        onNext(100, 'abc'),
        onNext(200, 'def'),
        onNext(250, 'ghi'),
        onNext(300, 'pqr'),
        onNext(450, 'xyz'),
        onCompleted(500)
    )

    var results = scheduler.startWithTiming(
        function () {
            return input.buffer(function () {
                return input.debounce(100, scheduler)
            })
            .map(function (b) {
                return b.join(',')
            });
        },
        50,  // created
        150, // subscribed
        600  // disposed
    )

  it('should do the other stuff too !', function() {
    console.log("tesing one two")
    collectionAssert.assertEqual(results.messages, [
        onNext(400, 'def,ghi,pqr'),
        onNext(500, 'xyz'),
        onCompleted(500)
    ])

    collectionAssert.assertEqual(input.subscriptions, [
        subscribe(150, 500),
        subscribe(150, 400),
        subscribe(400, 500)
    ])
  })
});