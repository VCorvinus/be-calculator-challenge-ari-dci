// loading var from .env
require("dotenv").config();
// imp exp mod
const express = require("express");
// imp bod mod
const bodyParser = require("body-parser");
// inst of app
const app = express();
// imp path mod
const path = require("path");
// use 2 parse data

app.use(express.static(path.join(__dirname)));

app.use(bodyParser.urlencoded({ extended: true }));
// def route hand
app.get("/", (req, res) => {
  // srv html
  res.sendFile(path.join(__dirname, "bmiCalculator.html")); // changed from index
});
// prs num 4 bmi
app.post("/bmicalculator", (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);

  const bmi = weight / (height * height);

  const bmiCategories = {
    "Severe Thinness": {
      min: 0,
      max: 15.9,
      label: "severely underweight",
      comment: "perfect",
    },
    "Moderate Thinness": {
      min: 16,
      max: 16.9,
      label: "moderately underweight",
      comment: "close to perfection",
    },
    "Mild Thinness": {
      min: 17,
      max: 18.4,
      label: "mildly underweight",
      comment: "ideal but not perfect",
    },
    Normal: { min: 18.5, max: 24.9, label: "normal", comment: "basic" },
    Overweight: { min: 25, max: 29.9, label: "overweight", comment: "chubby" },
    "Obesity Class I": {
      min: 30,
      max: 34.9,
      label: "obese Class I",
      comment: "fat",
    },
    "Obesity Class II": {
      min: 35,
      max: 39.9,
      label: "obese Class II",
      comment: "very fat",
    },
    "Obesity Class III": {
      min: 40,
      max: Infinity,
      label: "obese Class III",
      comment: "extremely fat",
    },
  };

  // feed category
  let category;
  for (const [key, value] of Object.entries(bmiCategories)) {
    if (bmi >= value.min && bmi <= value.max) {
      category = value.label;
      comment = value.comment;

      break;
    }
  }

  // feedback
  let feedback = `Your BMI is<br> <span class="bmi-number">${bmi.toFixed(
    2
  )}</span>`;
  if (category) {
    feedback += `You are ${category}.<br>`;
    feedback += `You are ${comment}.<br>`;
  } else {
    feedback += "BMI category not found.";
  }

  // res
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>BMI Calculator Result</title>
      <link rel="stylesheet" href="res.css" />
    </head>
    <body>
      <div id="resultContainer" class="result">${feedback}</div>
    </body>
    </html>
  `);
});

// prs num 4 reg
app.post("/", (req, res) => {
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  const operation = req.body.operation;
  // calc
  let result;
  switch (operation) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;
    case "/":
      // is / 0?
      if (num2 === 0) {
        return res.send("Error: Division by zero");
      }
      result = num1 / num2;
      break;
    default:
      return res.send("Error: Invalid operation");
  }
  // res
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Calculator Result</title>
      <link rel="stylesheet" href="res.css" />
    </head>
    <body>
      <div id="resultContainer" class="result">The result of the calculation is: ${result}</div>
    </body>
    </html>
  `);
});

// set prt
const PORT = process.env.PORT || 3000;
//start srv
app.listen(PORT, () => {
  // log msg
  console.log(`Server is running on port ${PORT}`);
});
