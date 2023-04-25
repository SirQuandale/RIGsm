const imageContainer = document.querySelector('#image-container');
const captionContainer = document.querySelector('#caption-container');
const sourceButton = document.querySelector('#source-button');
let lastMediaUrl;

async function getRandomMedia() {
  const subreddits = [
    'pics',
    'earthporn',
    'aww',
    'foodporn',
    'cats',
    'dogs',
    'itookapicture',
    'art',
    'architecture',
    'cityporn',
    'villageporn',
    'spaceporn',
    'wallpapers',
    'historyporn',
    'oldschoolcool',
    'bookporn',
    'fractalporn',
    'machineporn',
    'natureisfuckinglit',
    'map_porn',
    'futureporn',
    'retrofuturism',
    'abandonedporn',
    'aerialporn',
    'designporn',
    'geologyporn',
    'skyporn',
    'botanicalporn',
    'vintageads',
    'analog',
    'blackandwhite',
    'colorizedhistory',
    'history',
    'industrialporn',
    'musicbattlestations',
    'penmanshipporn',
    'techwearclothing',
    'vaporwaveart',
    'vaporwaveaesthetics'
  ];      
  const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
  const response = await fetch(`https://www.reddit.com/r/${randomSubreddit}/random.json`);
  const data = await response.json();
  const mediaData = data[0].data.children[0].data;
  const mediaUrl = mediaData.url;
  const mediaType = mediaData.post_hint;
  const mediaTitle = mediaData.title;
  const sourceUrl = 'https://www.reddit.com' + mediaData.permalink;
  
  if (mediaUrl === lastMediaUrl) {
    // if the same media was fetched again, recursively call the function again to get a new media
    return getRandomMedia();
  } else {
    lastMediaUrl = mediaUrl;
    captionContainer.textContent = mediaTitle;
    sourceButton.setAttribute('href', sourceUrl);
    
    if (mediaType === 'image') {
      return { url: mediaUrl, type: 'image' };
    } else if (mediaType === 'hosted:video') {
      const videoUrl = mediaData.media.reddit_video.fallback_url;
      return { url: videoUrl, type: 'video' };
    } else if (mediaType === 'rich:video') {
      const videoUrl = mediaData.media.reddit_video.fallback_url;
      return { url: videoUrl, type: 'video' };
    } else {
      // if media type is not image or video, recursively call the function again to get a new media
      return getRandomMedia();
    }
  }
}

async function displayRandomMedia() {
  try {
    const randomMedia = await getRandomMedia();
    
    if (randomMedia.type === 'image') {
      imageContainer.innerHTML = `<img src="${randomMedia.url}" alt="${captionContainer.textContent}" class="img-fluid" id="image-container">`;
    } else if (randomMedia.type === 'video') {
      imageContainer.innerHTML = `<video controls><source src="${randomMedia.url}" id="image-container" class="video-container"></video>`;
    }
  } catch (error) {
    getRandomMedia();
  }
}

imageContainer.addEventListener('click', displayRandomMedia);
sourceButton.addEventListener('click', function () {
    const sourceUrl = sourceButton.getAttribute('href');
    window.open(sourceUrl, '_blank');
});


// Call displayRandomMedia function when the page first loads
displayRandomMedia();