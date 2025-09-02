function handleReport(e){
  e.preventDefault();
  const title = document.getElementById('title').value || 'Untitled';
  alert('Demo: Report submitted — "' + title + '". (In production this connects to backend)');
  e.target.reset();
}