// increase and decrease spinners

function participantsStepUp(event)
{
  event.preventDefault();
  document.getElementById("part_num").stepUp();
}

function participantsStepDown(event)
{
  event.preventDefault();
  document.getElementById("part_num").stepDown();
}

function durationStepUp(event)
{
  event.preventDefault();
  document.getElementById("dur_num").stepUp();
}

function durationStepDown(event)
{
  event.preventDefault();
  document.getElementById("dur_num").stepDown();
}