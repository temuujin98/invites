import { backgroundChoices } from '../backgrounds'

export default function BackgroundPicker({ template, value, onChange }) {
  return (
    <fieldset className="background-picker">
      <legend>Урилгын дэвсгэр</legend>
      <div className="background-options">
        {backgroundChoices(template).map((background) => {
          const selected = (value || '') === background.id
          return (
            <button
              key={background.id || 'default'}
              type="button"
              className={`background-option ${selected ? 'selected' : ''}`}
              onClick={() => onChange(background.id)}
              aria-pressed={selected}
            >
              <img src={background.thumb} alt="" loading="lazy" width="400" height="711" />
              <span>{background.name}</span>
            </button>
          )
        })}
      </div>
      <p className="kfield-hint">Сонгосон дэвсгэр шууд харагдац болон зочны урилгад ашиглагдана</p>
    </fieldset>
  )
}
