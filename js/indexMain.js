window.addEventListener("DOMContentLoaded", function () {
    // בטיעינת עמוד
    openSession("name");
});
  
function insertNameToHtml(name) {
    document.getElementById("namePlace").innerHTML+=name;
}