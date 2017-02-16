// basketfunc.js
// const rev = require('./report.js');
//
// //print data
// //console.log(rev.getData());
// let data = undefined;

//data to process is a JavaScript object
function processGameData(dataToProcess) {

  let team1Score = 0;
  let team2Score = 0;
  let maxRebounds = 0;
  let maxReboundsName = "";
  let threePointMax = 0;
  let threePointMaxName = "";
  let stats = "";
  let totalBlocks = 0;

  const teams = [dataToProcess.hls.pstsg, dataToProcess.vls.pstsg];
  stats += "Game ID: " + dataToProcess.gid + "   " + dataToProcess.gdte + "\n =====";

  dataToProcess.hls.pstsg.forEach(function(element) {

    team1Score += ((element.fgm - element.tpm) * 2) + element.ftm + (element.tpm * 3);

  });

  dataToProcess.vls.pstsg.forEach(function(element) {

    team2Score += ((element.fgm - element.tpm) * 2) + element.ftm + (element.tpm * 3);

  });

  stats += "\n" + dataToProcess.vls.tc + " " + dataToProcess.vls.tn + " - " + team1Score;
  stats += "\n" + dataToProcess.hls.tc + " " + dataToProcess.hls.tn + " - " + team2Score;
  console.log(stats);

  dataToProcess.vls.pstsg.forEach(function(element) {

    if((element.oreb + element.dreb) > maxRebounds) {

      maxRebounds = element.oreb + element.dreb;
      maxReboundsName = element.fn;

    }

  });

  dataToProcess.hls.pstsg.forEach(function(element) {

    if((element.oreb + element.dreb) > maxRebounds) {

      maxRebounds = element.oreb + element.dreb;
      maxReboundsName = element.fn + " " + element.ln;

    }

  });

  console.log('name: ', maxReboundsName + ' rebounds: ' + maxRebounds);

  teams.forEach(function(team){
    team.filter(function(element) {

      return element.tpa >= 5;

    }).forEach(function(element) {

      if((element.tpm / element.tpa) > threePointMax) {

        threePointMax = element.tpm / element.tpa;
        threePointMaxName = element.fn + " " + element.ln;
      }

    });
  });

  teams.forEach(function(team) {

    team.forEach(function(player) {

      if(player.blk >= 1) {

        totalBlocks++;

      }

    });

  });

  let badPlayers = dataToProcess.vls.tc + " " + dataToProcess.vls.tn + "\n";
  dataToProcess.vls.pstsg.filter(function(element) {

    return element.tov > element.ast;

  }).forEach(function(element) {

    badPlayers += "\t*" + element.fn + " " + element.ln + "\n";

  });

  badPlayers += "\n" + dataToProcess.hls.tc + " " + dataToProcess.hls.tn + "\n";
  dataToProcess.hls.pstsg.filter(function(element) {

    return element.tov > element.ast;

  }).forEach(function(element) {

    badPlayers += "\t*" + element.fn + " " + element.ln + "\n";

  });

  console.log(badPlayers);


  console.log("BLOCKS: " + totalBlocks);

  console.log('three point: ' + threePointMax + 'name: ' + threePointMaxName);

  //console.log("SCORE:" + team1Score + team2Score);

}

module.exports = processGameData;
