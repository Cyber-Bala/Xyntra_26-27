
import './CinematicVideoBackground.css'

const IMAGE_SOURCE = '/photos/image.png'

export default function CinematicVideoBackground({ isWarping = false }) {
  return (
    <div
      className={`cinematic-background ${isWarping ? 'is-warping' : ''}`}
      aria-hidden="true"
    >
      <img
        className="cinematic-background-image"
        src={IMAGE_SOURCE}
        alt=""
        draggable="false"
      />

      <div className="cinematic-background-scrim" />
      <div className="cinematic-background-blue-haze" />
    </div>
  )
}