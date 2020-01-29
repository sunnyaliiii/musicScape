// var mykey = config.MY_TOKEN
var mykey = '8538a1744a7fdaa59981232897501e04'
const searchForm = document.querySelector('.search-form')
const musicSearch = document.querySelector('#music-search')
const resultsSection = document.querySelector('.results')
const audio = document.querySelector('.music-player')
const widget = document.querySelector('.widget')

function playTrack(currentTrackDiv) {
    console.log(currentTrackDiv.id)
    audio.src = `${currentTrackDiv.id}?client_id=${mykey}`
    audio.autoplay = true

    while (widget.hasChildNodes()) {
        widget.removeChild(widget.firstChild)
    }

    let trackDivCopy = currentTrackDiv.cloneNode(true)
    widget.appendChild(trackDivCopy)

    let playHTML = `
  <h3 class="widget-text">Playing now:</h3>`
    widget.insertAdjacentHTML('afterbegin', playHTML)
}

searchForm.addEventListener('submit', function(event) {
    event.preventDefault()
    var search = musicSearch.value
    console.log(search)
    artistSearch(search)
})

function artistSearch(artist) {
    fetch(`https://api.soundcloud.com/users/?client_id=${mykey}&q=${artist}`, {})
        .then(function(response) {
            return response.json()
        })

    .then(function(json) {
        console.log(json)

        while (resultsSection.hasChildNodes()) {
            resultsSection.removeChild(resultsSection.firstChild)
        }

        for (var i = 0; i < 6; i++) {
            let artistInfo = {}
            artistInfo.id = json[i].id
            artistInfo.name = json[i].username
            artistInfo.picture = json[i].avatar_url
            artistInfo.trackCount = json[i].track_count

            let artistHTML = `
          <div class="artist" id="${artistInfo.id}">
            <img src="${artistInfo.picture}" alt="Picture of artist" class="artist-pic">
            <h3 class="name">${artistInfo.name}</h3>
            <p class="track-count"># of Tracks Avail: ${artistInfo.trackCount}</p>
          </div>`

            resultsSection.insertAdjacentHTML('beforeend', artistHTML)
        }
    })

    .then(function() {
        const artistDiv = document.querySelectorAll('.artist')
        for (var i = 0; i < artistDiv.length; i++) {
            let artistID = artistDiv[i].id
            artistDiv[i].addEventListener('click', function() {
                console.log(artistID)
                pullTracks(artistID)
            })
        }
    })

    function pullTracks(selectedName) {
        fetch(`https://api.soundcloud.com/users/${selectedName}/tracks/?client_id=${mykey}&limit=100`)
            .then(function(response) {
                return response.json()
            })
            .then(function(json) {
                console.log(json)

                while (resultsSection.hasChildNodes()) {
                    resultsSection.removeChild(resultsSection.firstChild)
                }

                if (json.length === 0) {
                    console.log('failure')
                    let failHeading =
                        `<h3 id="failHeading">Oops! Unfortunately, the artist you selected does not provide any free tracks for streaming. Please search again.</h3>
            `

                    resultsSection.insertAdjacentHTML('beforeend', failHeading)
                } else {
                    console.log('success')

                    let trackHeading =
                        `<div class="sort-bar">
              <h4 id="sorting">Results sorted alphabetically</h4>
            </div>`

                    resultsSection.insertAdjacentHTML('beforeend', trackHeading)

                    var tracksArray = []
                    for (var i = 0; i < json.length; i++) {
                        let trackInfo = {}
                        trackInfo.id = json[i].stream_url
                        trackInfo.picture = json[i].artwork_url
                        trackInfo.title = json[i].title
                        trackInfo.artist = json[i].user.username
                        tracksArray.push(trackInfo)
                    }

                    tracksArray.sort(function(x, y) {
                        var a = x.title.toUpperCase()
                        var b = y.title.toUpperCase()

                        if (a > b) {
                            return 1
                        }
                        if (a < b) {
                            return -1
                        }
                        return 0
                    })

                    console.log(tracksArray)

                    for (var g = 0; g < tracksArray.length; g++) {
                        let trackHTML = `
                <div class="track" id="${tracksArray[g].id}" onclick="playTrack(this)">
                  <img src="${tracksArray[g].picture}" alt="image not found" onerror=this.src="images/rick-astley.jpg" class="track-pic">
                  <p class="track-title">${tracksArray[g].title}</p>
                  <p class="track-artist">${tracksArray[g].artist}</p>
                </div>`

                        resultsSection.insertAdjacentHTML('beforeend', trackHTML)
                    }
                }
            })
    }
}
