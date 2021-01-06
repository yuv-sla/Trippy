window.onload = () => {
  // Load components
  const footerLoading = new rxjs.Observable(observer => {
    $("#footer").load("components/footer.html", () => observer.next());
  })};
  