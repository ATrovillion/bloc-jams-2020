import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
    constructor(props) {
        super(props);

        const album = albumData.find( album => {
            return album.slug === this.props.match.params.slug
        });

        this.state = {
            album: album,
            currentSong: album.songs[0],
            isPlaying: false,
            isHovered: [],
            currentTime: 0,
            duration: album.songs[0].duration,
            volume: 1
        };

        this.audioElement = document.createElement('audio');
        this.audioElement.src = album.songs[0].audioSrc;
    }

    play() {
        this.audioElement.play();
        this.setState({ isPlaying: true });
    }

    pause() {
        this.audioElement.pause();
        this.setState({ isPlaying: false });
    }

    componentDidMount() {
        this.eventListeners = {
            timeupdate: e => {
                this.setState({ currentTime: this.audioElement.currentTime })
            },
            durationchange: e => {
                this.setState({ duration: this.audioElement.duration });
            },
            volumechange: e => {
                this.setState({ volume: this.audioElement.volume });
            }
        };
        this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
        this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
    }

    componentWillUnmount() {
        this.audioElement.src = null;
        this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
        this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
    }

    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
    }

    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
            this.pause();
        } else if (song === null) {
            this.setState({ isHovered: [] })
        
        } else {
            if (!isSameSong) { this.setSong(song) }
            this.play();
        }
    }

    handlePrevClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.max(0, currentIndex - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    handleNextClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
        const newSong = this.state.album.songs[newIndex]
        this.setSong(newSong);
        this.play();
    }

    handleTimeChange(e) {
        const newTime = this.audioElement.duration * e.target.value;
        this.audioElement.currentTime = newTime;
        this.setState({ currentTime: newTime });
    }

    handleVolumeChange(e) {
        const newVolume = e.target.value;
        this.audioElement.volume = newVolume;
        this.setState({ volume: newVolume })
    }

    handleHover(song) {
        if (this.state.isHovered !== song) {
            this.setState({ isHovered: song })
        } else if (!song) {
            this.setState({ isHovered: []} )
        } else {
            return
        }  
    }

    formatTime(timeInSeconds) {
        if (isNaN(timeInSeconds) || timeInSeconds === 0) {
            return "-:--"
        }
        var minutes = Math.floor(timeInSeconds / 60);
        var seconds = Math.floor(timeInSeconds - (minutes * 60));
        return `${minutes}:${seconds}`
    }

    render() {
        return (
            <section className="album">
                <section id="album-info">
                    <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
                    <div className="album-details">
                        <h1 id="album-title">{this.state.album.title}</h1>
                        <h2 className="artist">{this.state.album.artist}</h2>
                        <div id="release-info">{this.state.album.releaseInfo}</div>
                    </div>
                </section>
                <table id="song-list">
                    <colgroup>
                        <col id="song-number-column" />
                        <col id="song-title-column" />
                        <col id="song-duration-column" />
                    </colgroup>
                    <tbody>
                        <tr>
                               <th>Number</th>
                               <th>Title</th>
                               <th>Duration</th>
                        </tr>
                        {this.state.album.songs.map( (song, index) => {
                            if (song === this.state.isHovered) {
                                if (this.state.isPlaying && song === this.state.currentSong) {
                                   return <tr onMouseLeave={() => this.handleHover()}><td><span></span></td><button className="ion-pause" onClick={() => this.handleSongClick(song)} ></button><td></td></tr>
                                } else {
                                   return <tr onMouseLeave={() => this.handleHover()}><td><span></span></td><button className="ion-play" onClick={() => this.handleSongClick(song)}></button><td></td></tr>
                                }
                            } else {
                                return <tr className="song" key={index}
                                onClick={() => this.handleSongClick(song)}
                                onMouseEnter={() => this.handleHover(song)}
                                onMouseLeave={() => this.handleHover()} 
                            >
                                <td>{index + 1}</td>
                                <td>{song.title}</td>
                                <td>{song.duration}</td>
                            </tr>
                            }
                            })}
                    </tbody>
                </table>
                <PlayerBar
                    isPlaying={this.state.isPlaying}
                    currentSong={this.state.currentSong}
                    currentTime={this.audioElement.currentTime}
                    duration={this.audioElement.duration}
                    volume={this.audioElement.volume}
                    handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                    handlePrevClick={() => this.handlePrevClick()}
                    handleNextClick={() => this.handleNextClick()}
                    handleTimeChange={(e) => this.handleTimeChange(e)}
                    handleVolumeChange={(e) => this.handleVolumeChange(e)}
                    formatTime={(timeInSeconds) => this.formatTime(timeInSeconds)}
                    />
            </section>
        );
    }
}

export default Album;