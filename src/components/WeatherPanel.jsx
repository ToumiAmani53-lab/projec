import React from 'react';
import './WeatherPanel.css';

const WeatherIcon = ({ condition, isDay = true, size = 48 }) => {
  const c = (condition || '').toLowerCase();
  let type = 'cloudy';
  if (c.includes('soleil') || c.includes('clair') || c.includes('sunny') || c.includes('dégagé')) type = 'sun';
  else if (c.includes('pluie') || c.includes('rain') || c.includes('averse')) type = 'rain';
  else if (c.includes('orage') || c.includes('thunder')) type = 'storm';
  else if (c.includes('neige') || c.includes('snow')) type = 'snow';
  else if (c.includes('brum') || c.includes('brouillard') || c.includes('fog') || c.includes('mist')) type = 'fog';

  const icons = {
    sun: (
      <g stroke="var(--color-wheat)" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="24" cy="24" r="9" fill="var(--color-wheat)" stroke="none" />
        <path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.5 9.5l4.2 4.2M34.3 34.3l4.2 4.2M9.5 38.5l4.2-4.2M34.3 13.7l4.2-4.2" />
      </g>
    ),
    cloudy: (
      <g>
        <path
          d="M14 32a7 7 0 0 1-1-13.9A9 9 0 0 1 30 16a7.5 7.5 0 0 1 4 14.5"
          fill="none"
          stroke="var(--color-sky)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M14 32h20a5 5 0 0 0 0-10" fill="var(--color-sky-soft)" stroke="var(--color-sky)" strokeWidth="1.8" />
      </g>
    ),
    rain: (
      <g>
        <path
          d="M14 26a7 7 0 0 1-1-13.9A9 9 0 0 1 30 10a7.5 7.5 0 0 1 4 14.5H14Z"
          fill="var(--color-sky-soft)"
          stroke="var(--color-sky)"
          strokeWidth="1.6"
        />
        <path d="M16 32v6M24 32v6M32 32v6" stroke="var(--color-sky)" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    ),
    storm: (
      <g>
        <path
          d="M14 24a7 7 0 0 1-1-13.9A9 9 0 0 1 30 8a7.5 7.5 0 0 1 4 14.5H14Z"
          fill="var(--color-sky-soft)"
          stroke="var(--color-sky)"
          strokeWidth="1.6"
        />
        <path d="M25 26l-5 9h5l-3 8" stroke="var(--color-wheat)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    ),
    snow: (
      <g>
        <path
          d="M14 24a7 7 0 0 1-1-13.9A9 9 0 0 1 30 8a7.5 7.5 0 0 1 4 14.5H14Z"
          fill="var(--color-sky-soft)"
          stroke="var(--color-sky)"
          strokeWidth="1.6"
        />
        <circle cx="17" cy="34" r="1.6" fill="var(--color-sky)" />
        <circle cx="24" cy="36" r="1.6" fill="var(--color-sky)" />
        <circle cx="31" cy="34" r="1.6" fill="var(--color-sky)" />
      </g>
    ),
    fog: (
      <g stroke="var(--color-ink-soft)" strokeWidth="1.8" strokeLinecap="round">
        <path d="M8 18h32M6 24h36M10 30h28M14 36h20" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
      {icons[type]}
    </svg>
  );
};

const StatItem = ({ label, value, unit }) => (
  <div className="wp-stat">
    <span className="wp-stat-label">{label}</span>
    <span className="wp-stat-value">
      {value}
      <span className="wp-stat-unit">{unit}</span>
    </span>
  </div>
);

const WeatherPanel = ({ weather }) => {
  if (!weather) return null;
  const { location, current, forecast } = weather;

  return (
    <div className="wp-panel">
      <div className="wp-header">
        <div>
          <div className="wp-location">{location.name}{location.region ? `, ${location.region}` : ''}</div>
          <div className="wp-temp">{Math.round(current.tempC)}°<span className="wp-temp-unit">C</span></div>
          <div className="wp-condition">{current.condition}</div>
        </div>
        <WeatherIcon condition={current.condition} isDay={current.isDay} size={64} />
      </div>

      <div className="wp-stats-row">
        <StatItem label="Ressenti" value={Math.round(current.feelsLikeC)} unit="°C" />
        <StatItem label="Humidité" value={current.humidity} unit="%" />
        <StatItem label="Vent" value={Math.round(current.windKph)} unit="km/h" />
        <StatItem label="Précip." value={current.precipMm} unit="mm" />
        <StatItem label="UV" value={current.uv} unit="" />
      </div>

      {forecast && forecast.length > 0 && (
        <div className="wp-forecast">
          {forecast.map((day) => (
            <div className="wp-forecast-day" key={day.date}>
              <span className="wp-forecast-date">
                {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
              </span>
              <WeatherIcon condition={day.condition} size={32} />
              <span className="wp-forecast-temps">
                <strong>{Math.round(day.maxTempC)}°</strong> / {Math.round(day.minTempC)}°
              </span>
              <span className="wp-forecast-rain">💧 {day.chanceOfRain}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { WeatherIcon };
export default WeatherPanel;
