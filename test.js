var BatchProcessor = require('./src/batch-processor.js');

function test(expected, actual) {
    if (expected !== actual) {
        throw new Error("Expected: " + expected + ", Actual: " + actual);
    }
}

(function basic() {
    var bp = BatchProcessor({
        auto: false,
        async: false
    });

    var result = "";

    function f(v) {
        result += v;
    }

    bp.add(0, f.bind(null, "0"));
    bp.add(0, f.bind(null, "0"));
    bp.add(1, f.bind(null, "1"));
    bp.add(1, f.bind(null, "1"));
    bp.add(2, f.bind(null, "2"));

    bp.force();

    test("00112", result);
})();

(function async() {
    var bp = BatchProcessor({
        auto: false,
        async: true
    });

    var result = "";

    function f(v) {
        result += v;
    }

    bp.add(0, f.bind(null, "0"));
    bp.add(0, f.bind(null, "0"));
    bp.add(1, f.bind(null, "1"));
    bp.add(1, f.bind(null, "1"));
    bp.add(2, f.bind(null, "2"));

    bp.force();

    test("", result);

    setTimeout(function () {
        test("00112", result);
    }, 10);
})();

(function autoAsync() {
    var bp = BatchProcessor({
        auto: true,
        async: true
    });

    var result = "";

    function f(v) {
        result += v;
    }

    bp.add(0, f.bind(null, "0"));
    bp.add(0, f.bind(null, "0"));
    bp.add(1, f.bind(null, "1"));
    bp.add(1, f.bind(null, "1"));
    bp.add(2, f.bind(null, "2"));

    test("", result);

    setTimeout(function () {
        test("00112", result);
    }, 10);
})();

(function autoSync() {
    var warn = "";

    var bp = BatchProcessor({
        auto: true,
        async: false,
        reporter: {
            warn: function () {
                warn = "called";
            }
        }
    });

    test("called", warn);

    var result = "";

    function f(v) {
        result += v;
    }

    bp.add(0, f.bind(null, "0"));
    bp.add(0, f.bind(null, "0"));
    bp.add(1, f.bind(null, "1"));
    bp.add(1, f.bind(null, "1"));
    bp.add(2, f.bind(null, "2"));

    test("", result);

    setTimeout(function () {
        test("00112", result);
    }, 10);
})();
