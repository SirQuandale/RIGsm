const imageContainer = document.querySelector('#image-container');
const captionContainer = document.querySelector('#caption-container');
const sourceButton = document.querySelector('#source-button');
let lastMediaUrl;
let subreddits = [
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
  'musicbattlestations'
];

//variables for like, dislike and reactions
const likeButton = document.querySelector('#like-button');
const likeCount = document.querySelector('#like-count');
const dislikeButton = document.querySelector('#dislike-button');
const dislikeCount = document.querySelector('#dislike-count');
const reactionButton = document.querySelector('#reaction-button');
const reactionCount = document.querySelector('#reaction-count');
let reactionCountValue = 0;

let hasLiked = false;
let hasDisliked = false;

async function getRandomMedia() {
  const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
  const response = await fetch(`https://www.reddit.com/r/${randomSubreddit}/random.json`);
  const data = await response.json();
  const mediaData = data[0].data.children[0].data;
  const mediaUrl = mediaData.url;
  const mediaType = mediaData.post_hint;
  const mediaTitle = mediaData.title;
  const sourceUrl = 'https://www.reddit.com' + mediaData.permalink;
  resetLikeDislikeSystem();

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
      imageContainer.innerHTML = `<video controls><src="${randomMedia.url}" id="image-container" class="video-container"></video>`;
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

//like/dislike system + reaction count
likeButton.addEventListener('click', () => {
  if (!hasLiked) {
    likeButton.classList.add('clicked');
    likeCount.textContent = parseInt(likeCount.textContent) + 1;
    hasLiked = true;
    dislikeButton.disabled = true;
    if (hasDisliked) {
      dislikeButton.classList.remove('clicked');
      dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
      hasDisliked = false;
    }
  } else {
    likeButton.classList.remove('clicked');
    likeCount.textContent = parseInt(likeCount.textContent) - 1;
    hasLiked = false;
    dislikeButton.disabled = false;
  }
});

dislikeButton.addEventListener('click', () => {
  if (!hasDisliked) {
    dislikeButton.classList.add('clicked');
    dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
    hasDisliked = true;
    likeButton.disabled = true;
    if (hasLiked) {
      likeButton.classList.remove('clicked');
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
      hasLiked = false;
    }
  } else {
    dislikeButton.classList.remove('clicked');
    dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
    hasDisliked = false;
    likeButton.disabled = false;
  }
});

reactionButton.addEventListener('click', () => {
  reactionCountValue++;
  reactionCount.textContent = reactionCountValue;
});

function resetLikeDislikeSystem() {
  likeCount.textContent = 0;
  dislikeCount.textContent = 0;
  likeButton.classList.remove('clicked');
  dislikeButton.disabled = false;
  likeButton.disabled = false;
  dislikeButton.classList.remove('clicked');
  hasDisliked = false;
  hasLiked = false;
}

reactionButton.addEventListener('click', () => {
  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'reaction-popup';
  
  // Create reaction options
  const reactions = ['❤️', '😆', '😢', '😡', '🤔'];
  reactions.forEach((reaction) => {
    const button = document.createElement('button');
    button.className = 'reaction-option';
    button.textContent = reaction;
    button.addEventListener('click', () => {
      // Update reaction count and close popup
      reactionCount.textContent = parseInt(reactionCount.textContent) + 1;
      popup.remove();
    });
    popup.appendChild(button);
  });
  
  // Add popup to DOM
  document.body.appendChild(popup);
});
