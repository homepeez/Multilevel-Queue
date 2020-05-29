recalculateServiceTime();
$('.priority-only').hide();
console.log(recalculateServiceTime);
$(document).ready(function () {
  $('input[type=radio][name=algorithm]').change(function () {
    if (this.value == 'priority') {
      $('.priority-only').show();
      $('.servtime').show();
      $('#minus').css('left', '604px');
    }
    else {
      $('.priority-only').hide();
      $('.servtime').show();
      $('#minus').css('left', '428px');
    }

    if (this.value == 'robin') {
      $('.servtime').hide();
      $('#quantumParagraph').show();
    }
    else {
      $('#quantumParagraph').hide();
      $('.servtime').show();
    }

    recalculateServiceTime();

    console.log(recalculateServiceTime);
  });
});

function addRow() {
  var lastRow = $('#inputTable tr:last');
  var lastRowNumebr = parseInt(lastRow.children()[1].innerText);

  var newRow = '<tr><td>P'
  + (lastRowNumebr + 1)
  + '</td><td>'
  + (lastRowNumebr + 1)
  + '</td><td><input class="exectime" type="text"/></td><td class="servtime"></td>'
  //if ($('input[name=algorithm]:checked', '#algorithm').val() == "priority")
  + '<td class="priority-only"><input type="text"/></td>'
  +'<td><form id="algorithm"><input type="algorithm"></form></td></tr>';

  lastRow.after(newRow);

  var minus = $('#minus');
  minus.show();
  minus.css('top', (parseFloat(minus.css('top')) + 24) + 'px');

  if ($('input[name=algorithm]:checked', '#algorithm').val() != "priority")
    $('.priority-only').hide();


  $('#inputTable tr:last input').change(function () {
    recalculateServiceTime();
  });
}

function deleteRow() {
  var lastRow = $('#inputTable tr:last');
  lastRow.remove();

  var minus = $('#minus');
  minus.css('top', (parseFloat(minus.css('top')) - 24) + 'px');

  if (parseFloat(minus.css('top')) < 150)
    minus.hide();
}

$(".initial").change(function () {
  recalculateServiceTime();
});

function recalculateServiceTime() {
  var inputTable = $('#inputTable tr');
  var totalExectuteTime = 0;

  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[3]).text(totalExectuteTime);

      var executeTime = parseInt($(value.children[2]).children().first().val());
      totalExectuteTime += executeTime;
    });
    
  }


  else if (algorithm == "robin") {
    $('#minus').css('left', '335px');
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      $(value.children[3]).text("");
    });
  }
}



function animate() {
	$('fresh').prepend('<div id="curtain" style="position: absolute; right: 0; width:100%; height:100px;"></div>');
  
  $('#curtain').width($('#resultTable').width());
  $('#curtain').css({left: $('#resultTable').position().left});
  
  var sum = 0;
  $('.exectime').each(function() {
      sum += Number($(this).val());
  });
  
  console.log($('#resultTable').width());
  var distance = $("#curtain").css("width");
  
  animationStep(sum, 0);
  jQuery('#curtain').animate({ width: '0', marginLeft: distance}, sum*1000/2, 'linear');
}

function animationStep(steps, cur) {
	$('#timer').html(cur);
	if(cur < steps) {
		setTimeout(function(){ 
   	     animationStep(steps, cur + 1);
  	}, 500);
  }
  else {
  }
}

function draw() {
  $('fresh').html('');
  var inputTable = $('#inputTable tr');
  var th = '';
  var td = '';

  var algorithm = $('input[name=algorithm]:checked', '#algorithm').val();
  if (algorithm == "fcfs") {
    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      th += '<th style="height: 60px; width: ' + executeTime * 20 + 'px;">P' + (key - 1) + '</th>';
      td += '<td>' + executeTime + '</td>';
    });

    $('fresh').html('<table id="resultTable"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }

  else if (algorithm == "robin") {
    var quantum = $('#quantum').val();
    var executeTimes = [];

    $.each(inputTable, function (key, value) {
      if (key == 0) return true;
      var executeTime = parseInt($(value.children[2]).children().first().val());
      executeTimes[key - 1] = { "executeTime": executeTime, "P": key - 1 };
    });

    var areWeThereYet = false;
    while (!areWeThereYet) {
      areWeThereYet = true;
      $.each(executeTimes, function (key, value) {
        if (value.executeTime > 0) {
          th += '<th style="height: 60px; width: ' + (value.executeTime > quantum ? quantum : value.executeTime) * 20 + 'px;">P' + value.P + '</th>';
          td += '<td>' + (value.executeTime > quantum ? quantum : value.executeTime) + '</td>';
          value.executeTime -= quantum;
          areWeThereYet = false;
        }
      });
    }
    $('fresh').html('<table id="resultTable" style="width: 70%"><tr>'
                    + th
                    + '</tr><tr>'
                    + td
                    + '</tr></table>'
                   );
  }
  animate();
}