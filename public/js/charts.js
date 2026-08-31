// Lightweight Interactive SVG/Canvas Chart Generator for Admin Dashboard

export function renderCategoryPieChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 40px;">No application category data yet.</div>';
    return;
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
  const total = data.reduce((sum, item) => sum + item.count, 0);

  let cumulativeAngle = 0;
  const radius = 90;
  const cx = 120;
  const cy = 120;

  const paths = data.map((slice, i) => {
    const angle = (slice.count / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const x1 = cx + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = cy + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = cx + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
    const y2 = cy + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const color = colors[i % colors.length];

    return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z" fill="${color}" stroke="var(--bg-secondary)" stroke-width="2"><title>${slice.category}: ${slice.count} (${Math.round((slice.count/total)*100)}%)</title></path>`;
  }).join('');

  const legend = data.map((slice, i) => `
    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem;">
      <span style="width: 12px; height: 12px; border-radius: 3px; background: ${colors[i % colors.length]}; display: inline-block;"></span>
      <span style="color: var(--text-secondary);">${slice.category}</span>
      <strong style="color: var(--text-primary); margin-left: auto;">${slice.count}</strong>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap; justify-content: center;">
      <svg width="240" height="240" viewBox="0 0 240 240">${paths}</svg>
      <div style="display: flex; flex-direction: column; gap: 8px; min-width: 180px;">${legend}</div>
    </div>
  `;
}

export function renderTop5BarChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 40px;">No application ranking data yet.</div>';
    return;
  }

  const maxCount = Math.max(...data.map(d => d.applicationCount), 1);

  const bars = data.map((item, index) => {
    const percentage = Math.round((item.applicationCount / maxCount) * 100);
    return `
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
          <span style="font-weight: 600; color: var(--text-primary);">${index + 1}. ${item.schemeName}</span>
          <span style="font-weight: 700; color: var(--brand-primary);">${item.applicationCount} apps</span>
        </div>
        <div style="width: 100%; height: 10px; background: var(--bg-tertiary); border-radius: 999px; overflow: hidden;">
          <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #3b82f6, #0d9488); border-radius: 999px; transition: width 0.8s ease;"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `<div style="padding: 10px 0;">${bars}</div>`;
}

export function renderTrendLineChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 40px;">No historical monthly trends yet.</div>';
    return;
  }

  const maxTotal = Math.max(...data.map(d => d.total), 5);
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const points = data.map((d, index) => {
    const x = paddingX + (index / Math.max(data.length - 1, 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.total / maxTotal) * (chartHeight - paddingY * 2);
    return { x, y, data: d };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  const dots = points.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="2">
      <title>${p.data.month}: ${p.data.total} Applications (${p.data.approved} Approved, ${p.data.rejected} Rejected)</title>
    </circle>
    <text x="${p.x}" y="${chartHeight}" font-size="10" fill="var(--text-muted)" text-anchor="middle">${p.data.month}</text>
  `).join('');

  container.innerHTML = `
    <div style="width: 100%; overflow-x: auto;">
      <svg width="100%" height="180" viewBox="0 0 ${chartWidth} 180" preserveAspectRatio="none">
        <line x1="${paddingX}" y1="${chartHeight - paddingY}" x2="${chartWidth - paddingX}" y2="${chartHeight - paddingY}" stroke="var(--border-color)" stroke-width="1" />
        <polyline fill="none" stroke="#3b82f6" stroke-width="3" points="${polylinePoints}" />
        ${dots}
      </svg>
    </div>
  `;
}
