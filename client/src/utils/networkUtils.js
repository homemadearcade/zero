import axios from "axios";

export const testInternetSpeed = async () => {
  return new Promise(async (resolve, reject) => {
    var downloadSize = 499537; //bytes
    function detectDownloadSpeed() {
      var imageAddr = "https://i.imgur.com/92LVI9S.jpg"; 

      return new Promise((resolve, reject) => {
        var startTime, endTime;
        var download = new Image();
        download.onload = function (e) {
          endTime = (new Date()).getTime();
          // detectUploadSpeed(e.path[0])
          showResults();
        }
        
        download.onerror = function (err, msg) {
          // ShowProgressMessage("Invalid image, or error downloading");
        }
        
        startTime = (new Date()).getTime();
        var cacheBuster = "?nnn=" + startTime;
        download.src = imageAddr + cacheBuster;
        
        function showResults() {
          var duration = (endTime - startTime) / 1000;
          var bitsLoaded = downloadSize * 8;
          var speedBps = (bitsLoaded / duration).toFixed(2);
          var speedKbps = (speedBps / 1024).toFixed(2);
          var speedMbps = (speedKbps / 1024).toFixed(2);
          resolve(speedMbps)
        }
      })
    }

    function detectUploadSpeed() {
      return new Promise((resolve, reject) => {
        var http = new XMLHttpRequest();
        var startTime, endTime;
        var url = "/uploadtest";
        var myData = ""; // the raw data you will send
        for(var i = 0 ; i < downloadSize ; i++) //if you want to send 1 kb (2 + 1022 bytes = 1024b = 1kb). change it the way you want
        {
            myData += "k"; // add one byte of data;
        }

        http.open("POST", url, true);

        http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        http.onreadystatechange = function() {
          if(http.readyState === 4 && http.status === 200) {
              endTime = (new Date()).getTime();
              var duration = (endTime - startTime) / 1000;
              var bitsLoaded = downloadSize * 8;
              var speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2);
              resolve(speedMbps)
            }
        }
        startTime = (new Date()).getTime();
        http.send(JSON.stringify({value: myData}));
      })
    }

    let downloadSpeed = 0;
    let uploadSpeed = 0;

    setTimeout(() => {
      resolve([downloadSpeed, uploadSpeed])
    }, 15000)

    downloadSpeed = await detectDownloadSpeed()
    uploadSpeed = await detectUploadSpeed()

    resolve([downloadSpeed, uploadSpeed])
  })
}

export const uploadToAws = async (id, file) => {
  const contentType = file.type; // eg. image/jpeg or image/svg+xml

  const options = {
    params: {
      Key: id,
      ContentType: contentType || 'image/png'
    }
  };

  try {
    const generatedPutUrl = await axios.get('/api/aws/generate-put-url', options);
    return await axios.put('https://immense-fjord-18543.herokuapp.com/' + generatedPutUrl.data.url, file, {
      ...options,
      headers: {
        'Content-Type': contentType || 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }
    })
  } catch(e) {
    console.error(e)
  }


};