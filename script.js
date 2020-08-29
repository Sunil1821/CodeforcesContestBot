const axios = require('axios');
const webshot = require('node-webshot');

// take screenshot 
const webshot_options = { shotSize: { height: 'all' } };
const cheerio = require('cheerio');
var fs = require('fs');
const { exit } = require('process');
var contest_dir;
var contest_number; 

url = 'http://codeforces.com/contest/1256/problem/C'

let getTestCaseFromProblemHtml = (dir, html) => {

  // fs.writeFileSync(`${dir}/problem.html`, html, err => console.log(err));
  // no point of writing html 
  fs.copyFileSync(`${dir}/../../template.cpp`, `${dir}/sol.cpp`);
  data = [];
  const $ = cheerio.load(html);
  $('div.input pre').each((i, elem) => {
    data[i] = {
      ...data[i],
      input: $(elem).text()
    };
  });
  $('div.output pre').each((i, elem) => {
    data[i] = ({
      ...data[i],
      output: $(elem).text()
    });
  });
  // console.log(data);
  data.forEach((test, i) => {
    fs.writeFile(`${dir}/in_${i}.txt`, test.input, function(err) {
      if(err) {
          console.log(err);
      }
      // console.log(`The file ${dir}/in_${i}.txt was saved!`);
    }); 
    fs.writeFile(`${dir}/out_${i}.txt`, test.output, function(err) {
      if(err) {
          console.log(err);
      }
      // console.log(`The file ${dir}/out_${i}.txt was saved!`);
    }); 
  })
  // console.log(data);
}

function getTestCaseFromProblemUrl(url) {
  var dir = `./${contest_number}/${url.substring(url.lastIndexOf('/')+1)}`;

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  webshot(url, `${dir}/problem.png`, webshot_options, err => console.log(err));

  axios.get(url)
    .then(response => {
      // console.log(response);
      getTestCaseFromProblemHtml(dir, response.data);
    }
    )
    .catch(err => console.log(err));
}

// getTestCaseFromProblemUrl(url);

contest_url = 'http://codeforces.com/contest/1256';

// ''
let getTotalProblemsFromContestHtml = (html) => {
  data = [];
  const $ = cheerio.load(html);
  console.log('parsing');
  $('tr td.id a').each((i, elem) => {
    problem_url = 'https://codeforces.com/' + $(elem).attr('href')
    console.log(problem_url);
    getTestCaseFromProblemUrl(problem_url);
  });
}

// DONE : modify this to take just the contest number and update the response.data with complete codeforces contest url
// DONE : the different problem folder should be in a new directory named <contest number> 
// DONE : alias running the script.js to compete <contest number> --> everything setup 
// DONE : create a launch.json to compile the c++ file with pbds --> able to F5 the cpp file   
// DONE : modify the F5 to compile the C++ file and run the inputs on the ouput.txt and compare the results
// F5 cannot be altered easily created -- command line command ctest to test the cpp file with all the inputs and compare the ouputs
// TODO : modify the F6 command to upload to Codeforces url -- will need a token -- identify how 
// DONE : automated getting the status of the contest --- $> status // automatically it will get the status for you
// console.log(process.argv);

console.log(process.argv)

fs.writeFile("/home/sunil/shell_scripts/codeforces_env", process.argv[2], err => console.log(err))

url = "https://codeforces.com/contest/" + process.argv[2];

contest_number = process.argv[2];

console.log(url);

contest_dir = `./${process.argv[2]}`;

if (!fs.existsSync(contest_dir)){
    fs.mkdirSync(contest_dir);
}

vscode_dir = `${contest_dir}/.vscode`;

if (!fs.existsSync(vscode_dir)){
  fs.mkdirSync(vscode_dir);
}

fs.copyFileSync(`.vscode/launch.json`, `${vscode_dir}/launch.json`);


axios.get(url)
    .then(response => {
      // console.log(response);
      getTotalProblemsFromContestHtml(response.data);
    });
