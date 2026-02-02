import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, 
  Clock, MapPin, Users, Video, Phone
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_type: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  status: string;
  google_event_id: string | null;
}

const eventTypeConfig: Record<string, { label: string; icon: typeof CalendarIcon; className: string }> = {
  termin: { label: 'Termin', icon: Users, className: 'bg-blue-500' },
  meeting: { label: 'Meeting', icon: Video, className: 'bg-purple-500' },
  wiedervorlage: { label: 'Wiedervorlage', icon: Phone, className: 'bg-orange-500' },
  deadline: { label: 'Deadline', icon: Clock, className: 'bg-red-500' }
};

export function CalendarManagement() {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    event_type: 'termin',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    all_day: false
  });

  useEffect(() => {
    loadEvents();
  }, [currentMonth]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from('crm_calendar_events')
        .select('*')
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString())
        .order('start_time');

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: 'Fehler',
        description: 'Termine konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newEvent.title || !newEvent.start_date) {
      toast({
        title: 'Fehler',
        description: 'Bitte Titel und Datum angeben.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const startDateTime = new Date(`${newEvent.start_date}T${newEvent.start_time}`);
      const endDateTime = new Date(`${newEvent.start_date}T${newEvent.end_time}`);

      const { error } = await supabase.from('crm_calendar_events').insert({
        title: newEvent.title,
        description: newEvent.description || null,
        location: newEvent.location || null,
        event_type: newEvent.event_type,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        all_day: newEvent.all_day,
        status: 'geplant'
      });

      if (error) throw error;

      toast({ title: 'Termin erstellt' });
      setNewEvent({
        title: '',
        description: '',
        location: '',
        event_type: 'termin',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        start_time: '09:00',
        end_time: '10:00',
        all_day: false
      });
      setIsCreateOpen(false);
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Fehler',
        description: 'Termin konnte nicht erstellt werden.',
        variant: 'destructive'
      });
    }
  };

  // Calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.start_time), day));
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: de })}
          </h2>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => setCurrentMonth(new Date())}>
            Heute
          </Button>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Neuer Termin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuer Termin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Titel *</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Terminbezeichnung"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Typ</Label>
                  <Select 
                    value={newEvent.event_type} 
                    onValueChange={(v) => setNewEvent(prev => ({ ...prev, event_type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(eventTypeConfig).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Datum *</Label>
                  <Input
                    type="date"
                    value={newEvent.start_date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Von</Label>
                  <Input
                    type="time"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Bis</Label>
                  <Input
                    type="time"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Ort</Label>
                <Input
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="z.B. Online, Büro..."
                />
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Weitere Details..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleCreate}>
                  Erstellen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(day => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isDayToday = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-[80px] p-1 text-left rounded-lg border transition-all
                      ${isCurrentMonth ? 'bg-background' : 'bg-muted/50 text-muted-foreground'}
                      ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'}
                      ${isDayToday ? 'bg-primary/5' : ''}
                      hover:bg-muted/50
                    `}
                  >
                    <span className={`
                      text-sm font-medium 
                      ${isDayToday ? 'bg-primary text-primary-foreground rounded-full px-2 py-0.5' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map(event => {
                        const config = eventTypeConfig[event.event_type] || eventTypeConfig.termin;
                        return (
                          <div 
                            key={event.id}
                            className={`text-xs truncate rounded px-1 py-0.5 text-white ${config.className}`}
                          >
                            {format(new Date(event.start_time), 'HH:mm')} {event.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2} weitere
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate ? format(selectedDate, 'EEEE, d. MMMM', { locale: de }) : 'Tag auswählen'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground">
                Klicken Sie auf einen Tag, um die Termine zu sehen.
              </p>
            ) : selectedDayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Keine Termine an diesem Tag.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map(event => {
                  const config = eventTypeConfig[event.event_type] || eventTypeConfig.termin;
                  const Icon = config.icon;

                  return (
                    <div key={event.id} className="p-3 rounded-lg border">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg text-white ${config.className}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.start_time), 'HH:mm')} - {format(new Date(event.end_time), 'HH:mm')}
                          </p>
                          {event.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedDate && (
              <Button 
                className="w-full mt-4 gap-2" 
                variant="outline"
                onClick={() => {
                  setNewEvent(prev => ({
                    ...prev,
                    start_date: format(selectedDate, 'yyyy-MM-dd')
                  }));
                  setIsCreateOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Termin hinzufügen
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info about Google Calendar */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Google Calendar Integration</p>
              <p className="text-sm text-muted-foreground">
                Um die Google Calendar Synchronisation zu aktivieren, wird ein Google Cloud API-Schlüssel benötigt.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
