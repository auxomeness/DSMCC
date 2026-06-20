import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type CalendarMarker = {
  date: string
  label: string
}

type InteractiveCalendarProps = {
  markers?: CalendarMarker[]
  name?: string
  onSelectDate?: (date: string) => void
  selectedDate?: string
}

const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function InteractiveCalendar({
  markers = [],
  name,
  onSelectDate,
  selectedDate,
}: InteractiveCalendarProps) {
  const todayIso = toIsoDate(new Date())
  const isControlled = selectedDate !== undefined && onSelectDate !== undefined
  const [internalSelectedDate, setInternalSelectedDate] = useState(selectedDate ?? todayIso)
  const activeDate = isControlled ? selectedDate : internalSelectedDate
  const [visibleMonth, setVisibleMonth] = useState(() => toDate(activeDate))

  useEffect(() => {
    if (isControlled) {
      setVisibleMonth(toDate(activeDate))
    }
  }, [activeDate, isControlled])

  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth])
  const markerMap = useMemo(() => {
    return markers.reduce<Map<string, CalendarMarker[]>>((map, marker) => {
      const group = map.get(marker.date) ?? []
      group.push(marker)
      map.set(marker.date, group)
      return map
    }, new Map())
  }, [markers])

  const selectedMarkers = markerMap.get(activeDate) ?? []
  const years = useMemo(() => {
    const currentYear = visibleMonth.getFullYear()
    return Array.from({ length: 7 }, (_, index) => currentYear - 2 + index)
  }, [visibleMonth])

  function handleSelectDate(date: Date) {
    const nextDate = toIsoDate(date)
    setInternalSelectedDate(nextDate)
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    onSelectDate?.(nextDate)
  }

  function moveMonth(direction: -1 | 1) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  function setMonth(month: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), month, 1))
  }

  function setYear(year: number) {
    setVisibleMonth((current) => new Date(year, current.getMonth(), 1))
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      {name ? <input name={name} type="hidden" value={activeDate} /> : null}

      <div className="flex items-center gap-2">
        <Button
          className="h-9 w-9 shrink-0 rounded-lg bg-[#fff3ed] p-0 text-[#d65b2b] hover:bg-[#fbd9c7]"
          title="Previous month"
          type="button"
          onClick={() => moveMonth(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>

        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_86px] gap-2">
          <select
            aria-label="Calendar month"
            className="h-9 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-sm font-bold text-slate-800 outline-none focus:border-[#d65b2b] focus:ring-3 focus:ring-[#d65b2b]/15"
            value={visibleMonth.getMonth()}
            onChange={(event) => setMonth(Number(event.target.value))}
          >
            {monthLabels.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            aria-label="Calendar year"
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm font-bold text-slate-800 outline-none focus:border-[#d65b2b] focus:ring-3 focus:ring-[#d65b2b]/15"
            value={visibleMonth.getFullYear()}
            onChange={(event) => setYear(Number(event.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <Button
          className="h-9 w-9 shrink-0 rounded-lg bg-[#fff3ed] p-0 text-[#d65b2b] hover:bg-[#fbd9c7]"
          title="Next month"
          type="button"
          onClick={() => moveMonth(1)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500">
        {dayLabels.map((day) => (
          <div className="py-1 font-bold text-slate-700" key={day}>
            {day}
          </div>
        ))}

        {calendarDays.map((date) => {
          const isoDate = toIsoDate(date)
          const isSelected = isoDate === activeDate
          const isToday = isoDate === todayIso
          const isCurrentMonth = date.getMonth() === visibleMonth.getMonth()
          const hasMarkers = markerMap.has(isoDate)

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                'relative flex aspect-square min-h-9 items-center justify-center rounded-lg text-sm font-semibold transition',
                isCurrentMonth ? 'text-slate-700' : 'text-slate-300',
                'hover:bg-[#fff3ed] hover:text-[#d65b2b]',
                isToday && !isSelected && 'bg-slate-100 text-slate-950',
                hasMarkers && !isSelected && 'bg-[#fff3ed] text-[#d65b2b]',
                isSelected && 'bg-[#d65b2b] text-white hover:bg-[#c64f23] hover:text-white',
              )}
              key={isoDate}
              title={markerMap.get(isoDate)?.map((marker) => marker.label).join(', ')}
              type="button"
              onClick={() => handleSelectDate(date)}
            >
              {date.getDate()}
              {hasMarkers ? (
                <span
                  className={cn(
                    'absolute bottom-1 h-1.5 w-1.5 rounded-full',
                    isSelected ? 'bg-white' : 'bg-[#d65b2b]',
                  )}
                />
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="mt-3 rounded-lg bg-[#fafafa] p-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          <CalendarDays className="h-4 w-4 text-[#d65b2b]" />
          Selected Date
        </div>
        <p className="mt-2 text-sm font-bold text-slate-950">{formatLongDate(activeDate)}</p>
        {selectedMarkers.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {selectedMarkers.map((marker) => (
              <li className="text-xs font-medium text-[#d65b2b]" key={marker.label}>
                {marker.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-slate-500">No scheduled items for this date.</p>
        )}
      </div>
    </div>
  )
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return date
  })
}

function toDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatLongDate(isoDate: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  }).format(toDate(isoDate))
}
