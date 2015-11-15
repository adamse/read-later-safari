function getPostData() {
  console.log("getting post data");

  var activeTab = safari.application.activeBrowserWindow.activeTab;

  var url = activeTab.url;
  var description = activeTab.title;
  var apiToken = safari.extension.secureSettings.PinboardAPIToken;

  var data
      = {"url": url,
         "description": description,
         "toread": "yes",
         "replace": "yes",
         "auth_token": apiToken,
         "format": "json",
        };

  console.log("got data");
  console.log(data);

  return data;
}

function changeIcon(button, icon) {
  button.image = safari.extension.baseURI + "icons/" + icon + ".png"
}

function handleReadLater(event) {
  if (event.command !== "PinboardReadLater") {
    return;
  }

  console.log("handling Read Later");

  var button = event.target;

  var data = getPostData();

  var queryString
      = "?"
      + Object
      .keys(data)
      .reduce(function(acc, key) {
        acc.push(key + "=" + encodeURIComponent(data[key]));
        return acc;
      }, []).join("&");

  console.log(queryString);

  var url = "https://api.pinboard.in/v1/posts/add" + queryString;

  console.log("sending request: " + url);
  var req = new XMLHttpRequest();

  req.addEventListener("load", function(){
    var res = JSON.parse(this.responseText);
    if (res.result_code === "done") {
      console.log("success");
      changeIcon(button, "success");
    } else {
      console.log("failure");
      changeIcon(button, "failure");
    }

    setTimeout(changeIcon, 800, button, "readlater");
  });

  req.open("GET", url);
  req.send();
  changeIcon(button, "dots");

}

function setup() {
  console.log("setting up");
  safari.application.addEventListener("command", handleReadLater);
}

setup();
