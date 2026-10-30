import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom';
import { asset } from '../static.js';

/**
 * Single-layer map: one `geo` component carries both the base map and the
 * per-province tier colors via `geo.regions`. Markers live on the same geo,
 * so nothing can drift out of sync while roaming / zooming.
 */
export default function ChinaMap({ mapData, filter, onProvinceInfo }) {
  const ref = useRef(null);
  const nav = useNavigate();
  const filterRef = useRef(filter);
  filterRef.current = filter;

  useEffect(() => {
    const el = ref.current;
    const chart = echarts.init(el);

    const buildOption = () => {
      const { tiers } = mapData;
      const locMarkers = mapData.locations
        .filter(l => filterRef.current === 'all' || l.types.includes(filterRef.current))
        .map(l => ({
          name: l.name,
          value: [...l.coords, 8],
          label: { position: l.id === 'shanghai' ? 'left' : 'top' },
        }));
      const storyMarkers = (mapData.stories || []).map(s => ({
        name: s.title, id: s.id, value: [...s.coords, 6],
      }));
      const regions = [
        ...tiers.featured.map(n => ({
          name: n, itemStyle: { areaColor: '#f5a623' }, label: { color: '#fff', fontWeight: 700 },
        })),
        ...tiers.participating
          .filter(n => !tiers.featured.includes(n))
          .map(n => ({ name: n, itemStyle: { areaColor: '#3d5f83' } })),
      ];
      return {
        tooltip: {
          backgroundColor: '#0a1c2c', borderWidth: 0, textStyle: { color: '#fff', fontSize: 12 },
          formatter: p => {
            if (p.seriesType === 'effectScatter') return `<b>${p.name}</b><br>Click to open its projects`;
            if (p.seriesType === 'scatter') return `<b>${p.name}</b><br>Click to read the story`;
            const loc = mapData.locations.find(l => l.geo === p.name);
            if (loc) return `<b>${p.name}</b><br>${loc.tagline}`;
            if (mapData.tiers.participating.includes(p.name)) return `<b>${p.name}</b><br>Go Far courses are running here`;
            return `<b>${p.name}</b><br>A Dream Center is on its way`;
          },
        },
        geo: {
          map: 'china', roam: true, scaleLimit: { min: 1, max: 14 },
          center: [104.5, 36.5], zoom: 1.12,
          label: { show: true, fontSize: 9, color: '#7d97ad' },
          itemStyle: { areaColor: '#233f59', borderColor: '#0b2036', borderWidth: 1 },
          emphasis: {
            label: { color: '#fff', fontSize: 10 },
            itemStyle: { areaColor: '#f7c36b' },
          },
          regions,
        },
        series: [
          {
            type: 'effectScatter', coordinateSystem: 'geo', zlevel: 3,
            rippleEffect: { brushType: 'stroke', scale: 2.6, period: 4 },
            symbolSize: 11,
            itemStyle: { color: '#ffd166', shadowBlur: 12, shadowColor: '#f5a623' },
            label: {
              show: true, position: 'top', formatter: '{b}',
              color: '#ffe9b8', fontSize: 10, fontWeight: 700,
            },
            data: locMarkers,
          },
          {
            type: 'scatter', coordinateSystem: 'geo', zlevel: 2,
            symbolSize: 12,
            itemStyle: { color: '#7fd1c0', borderColor: '#0d2438', borderWidth: 1.5 },
            data: storyMarkers,
          },
        ],
      };
    };

    fetch(asset('/geo/china.json'))
      .then(r => r.json())
      .then(geo => {
        if (chart.isDisposed()) return;
        echarts.registerMap('china', geo);
        chart.setOption(buildOption());
        window.__adreamMap = chart;
      })
      .catch(e => console.error('Failed to load map data', e));

    chart.on('click', p => {
      // Story dots are small and can sit under a province or a nearby marker
      // in hit-testing; prefer the nearest story when the click lands close to one.
      const nearestStory = () => {
        const c = p.event ? [p.event.offsetX, p.event.offsetY] : null;
        if (!c) return null;
        return (mapData.stories || [])
          .map(s => ({ s, d: Math.hypot(...chart.convertToPixel({ geoIndex: 0 }, s.coords).map((v, i) => v - c[i])) }))
          .sort((a, b) => a.d - b.d)[0];
      };
      if (p.seriesType === 'effectScatter') {
        const near = nearestStory();
        if (near && near.d < 18) {
          nav(`/story/${near.s.id}`);
          return;
        }
        const loc = mapData.locations.find(l => l.name === p.name);
        if (loc) nav(`/location/${loc.id}`);
      } else if (p.seriesType === 'scatter' && p.data?.id != null) {
        nav(`/story/${p.data.id}`);
      } else if (p.componentType === 'geo') {
        const near = nearestStory();
        if (near && near.d < 18) {
          nav(`/story/${near.s.id}`);
          return;
        }
        const loc = mapData.locations.find(l => l.geo === p.name);
        if (loc) nav(`/location/${loc.id}`);
        else if (mapData.tiers.participating.includes(p.name)) onProvinceInfo?.(p.name);
      }
    });

    const onResize = () => { if (!chart.isDisposed()) chart.resize(); };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (window.__adreamMap === chart) window.__adreamMap = null;
      chart.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const chart = window.__adreamMap;
    if (!chart || !mapData) return;
    const locMarkers = mapData.locations
      .filter(l => filter === 'all' || l.types.includes(filter))
      .map(l => ({
        name: l.name,
        value: [...l.coords, 8],
        label: { position: l.id === 'shanghai' ? 'left' : 'top' },
      }));
    chart.setOption({ series: [{ type: 'effectScatter', data: locMarkers }] });
  }, [filter, mapData]);

  return <div ref={ref} className="map-canvas" />;
}
