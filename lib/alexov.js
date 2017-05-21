#! /usr/bin/env node

/**
 * The contents of this file is free and unencumbered software released into the
 * public domain. For more information, please refer to <http://unlicense.org/>
 *
 * @author Maxmillion McLaughlin <npm@maxmclau.com>
 */

//'use strict';

let chalk = require('chalk');
let clear = require('clear');
let figlet = require('figlet');
let inquirer = require('inquirer');
let cheerio = require('cheerio');
let fetch = require('node-fetch');

let Spotify = require('spotify-web-api-node');
let Genius = require('genius-api');

var spotify = new Spotify({
  clientId : 'ef9f2c38786f4d5a9519bfc310c56d7a',
  clientSecret : '58c9074004094b96a83a811291aeb505'
});

const accessToken = 'Z3IaPnqNr_xJSE8dZQMQUm2zgs1s5_cIbYEGkZpJQcn55NnvyfYOmtPnsa_A-lrD'
const genius = new Genius(accessToken)

let intr = {
    header: ()=> {
        console.log();
        console.log(
          chalk.blue(
            figlet.textSync('alexov', {
                font: 'basic',
                horizontalLayout: 'full',
                verticalLayout: 'full'
            })
          )
        );
        console.log();
    },
    query: {
        getType: (callback)=> {
            inquirer.prompt(
                {
                  name: 'type',
                  type: 'list',
                  message: 'Generation type:',
                  choices: [
                      "User",
                      //new inquirer.Separator(),
                      "Artist",
                      "Top 40"
                  ],
                  validate: function(value) {
                    if (value.length) {
                      return true;
                    } else {
                      return 'Please select a generation type';
                    }
                  }
                }
            ).then(callback);
        },
        getRequest: (type, callback)=> {
            inquirer.prompt(
                {
                  name: 'request',
                  type: 'input',
                  message: 'What ' + type + ' would you like to desecrate?',
                  validate: function(value) {
                    if (value.length) {
                      return true;
                    } else {
                      return 'Please select a generation type';
                    }
                  }
                }
            ).then(callback);
        }
    }
};

function init() {
    clear();
    intr.header();

    genius.getSongLyrics('https://genius.com/Death-grips-guillotine-lyrics').then(lyrics => {
        console.log(lyrics)
    });



/*
    genius.getArtistIdByName('Death Grips')
        .then(artistId => {
            genius.songsByArtist(artistId, {
                per_page: 25,
                sort: 'popularity',
            })
            .then(items => {
                let urls = items.songs.map(song => song.url);
                console.log(urls)
            })
        })
        .catch(err => console.error(err))*/

/*
    spotify.searchArtists('Death Grips').then(function(data) {
        if(data.body.artists.items.length > 0) {
            let artist = data.body.artists.items[0];

            spotify.getArtistTopTracks(artist.id, 'GB').then(function(data) {
                let tracks = data.body.tracks;

            }, function(err) {
                console.log('Something went wrong!', err);
            });
        }
    }, function(err) {
        console.error(err);
    });*/

    /*intr.query.getType(function () {
        intr.query.getRequest(function () {
            console.log(arguments)
        });
    });*/
}

function parseSongHTML(htmlText) {
  const $ = cheerio.load(htmlText)
  const lyrics = $('.lyrics').text().replace(/\s*\[.*?\]\s*/g, '').replace(/\(|\)/g,'')
  return lyrics
  //const releaseDate = $('release-date .song_info-info').text()
  /*return {
    lyrics,
    releaseDate,
    }*/
}


Genius.prototype.getArtistIdByName = function getArtistIdByName(artistName) {
  const normalizeName = name => name.replace(/\./g, '').toLowerCase()   // regex removes dots
  const artistNameNormalized = normalizeName(artistName)

  return this.search(artistName)
    .then((response) => {
      for (let i = 0; i < response.hits.length; i += 1) {
        const hit = response.hits[i]
        if (hit.type === 'song' && normalizeName(hit.result.primary_artist.name) === artistNameNormalized) {
          return hit.result
        }
      }
      throw new Error(`Did not find any songs whose artist is "${artistNameNormalized}".`)
    })
    .then(songInfo => songInfo.primary_artist.id)
}

Genius.prototype.getSongLyrics = function getSongLyrics(geniusUrl) {
  return fetch(geniusUrl, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) return response.text()
    throw new Error('Could not get song url ...')
  })
  .then(parseSongHTML)
}

init();
