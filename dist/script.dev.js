"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var axios = require('axios');

var webshot = require('node-webshot'); // take screenshot 


var webshot_options = {
  shotSize: {
    height: 'all'
  }
};

var cheerio = require('cheerio');

var fs = require('fs');

var _require = require('process'),
    exit = _require.exit;

var contest_dir;
var contest_number;
url = 'http://codeforces.com/contest/1256/problem/C';

var getTestCaseFromProblemHtml = function getTestCaseFromProblemHtml(dir, html) {
  // fs.writeFileSync(`${dir}/problem.html`, html, err => console.log(err));
  // no point of writing html 
  fs.copyFileSync("".concat(dir, "/../../template.cpp"), "".concat(dir, "/sol.cpp"));
  data = [];
  var $ = cheerio.load(html);
  $('div.input pre').each(function (i, elem) {
    data[i] = _objectSpread({}, data[i], {
      input: $(elem).text()
    });
  });
  $('div.output pre').each(function (i, elem) {
    data[i] = _objectSpread({}, data[i], {
      output: $(elem).text()
    });
  }); // console.log(data);

  data.forEach(function (test, i) {
    fs.writeFile("".concat(dir, "/in_").concat(i, ".txt"), test.input, function (err) {
      if (err) {
        console.log(err);
      } // console.log(`The file ${dir}/in_${i}.txt was saved!`);

    });
    fs.writeFile("".concat(dir, "/out_").concat(i, ".txt"), test.output, function (err) {
      if (err) {
        console.log(err);
      } // console.log(`The file ${dir}/out_${i}.txt was saved!`);

    });
  }); // console.log(data);
};

function getTestCaseFromProblemUrl(url) {
  var dir = "./".concat(contest_number, "/").concat(url.substring(url.lastIndexOf('/') + 1));

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  webshot(url, "".concat(dir, "/problem.png"), webshot_options, function (err) {
    return console.log(err);
  });
  axios.get(url).then(function (response) {
    // console.log(response);
    getTestCaseFromProblemHtml(dir, response.data);
  })["catch"](function (err) {
    return console.log(err);
  });
} // getTestCaseFromProblemUrl(url);


contest_url = 'http://codeforces.com/contest/1256'; // ''

var getTotalProblemsFromContestHtml = function getTotalProblemsFromContestHtml(html) {
  data = [];
  var $ = cheerio.load(html);
  console.log('parsing');
  $('tr td.id a').each(function (i, elem) {
    problem_url = 'https://codeforces.com/' + $(elem).attr('href');
    console.log(problem_url);
    getTestCaseFromProblemUrl(problem_url);
  });
}; // DONE : modify this to take just the contest number and update the response.data with complete codeforces contest url
// DONE : the different problem folder should be in a new directory named <contest number> 
// DONE : alias running the script.js to compete <contest number> --> everything setup 
// DONE : create a launch.json to compile the c++ file with pbds --> able to F5 the cpp file   
// DONE : modify the F5 to compile the C++ file and run the inputs on the ouput.txt and compare the results
// F5 cannot be altered easily created -- command line command ctest to test the cpp file with all the inputs and compare the ouputs
// TODO : modify the F6 command to upload to Codeforces url -- will need a token -- identify how 
// DONE : automated getting the status of the contest --- $> status // automatically it will get the status for you
// console.log(process.argv);


console.log(process.argv);
fs.writeFile("/home/sunil/shell_scripts/codeforces_env", process.argv[2], function (err) {
  return console.log(err);
});
url = "https://codeforces.com/contest/" + process.argv[2];
contest_number = process.argv[2];
console.log(url);
contest_dir = "./".concat(process.argv[2]);

if (!fs.existsSync(contest_dir)) {
  fs.mkdirSync(contest_dir);
}

vscode_dir = "".concat(contest_dir, "/.vscode");

if (!fs.existsSync(vscode_dir)) {
  fs.mkdirSync(vscode_dir);
}

fs.copyFileSync(".vscode/launch.json", "".concat(vscode_dir, "/launch.json"));
axios.get(url).then(function (response) {
  // console.log(response);
  getTotalProblemsFromContestHtml(response.data);
});