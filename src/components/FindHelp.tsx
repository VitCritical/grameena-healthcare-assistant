import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Phone, Clock, Search, Guitar as Hospital, Stethoscope, Pill, AlertTriangle, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HealthcareService {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'emergency';
  address: string;
  phone?: string;
  hours?: string;
  lat: number;
  lng: number;
  distance?: number;
}

interface LocationComponentProps {
  onLocationFound: (lat: number, lng: number) => void;
}

const LocationComponent: React.FC<LocationComponentProps> = ({ onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
    
    const onLocationFound = (e: L.LocationEvent) => {
      onLocationFound(e.latlng.lat, e.latlng.lng);
    };

    map.on('locationfound', onLocationFound);
    
    return () => {
      map.off('locationfound', onLocationFound);
    };
  }, [map, onLocationFound]);

  return null;
};

const FindHelp: React.FC = () => {
  const { t } = useTranslation();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [services, setServices] = useState<HealthcareService[]>([]);
  const [filteredServices, setFilteredServices] = useState<HealthcareService[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample healthcare services data (in a real app, this would come from an API)
  const sampleServices: HealthcareService[] = [
    {
      id: '1',
      name: 'Government General Hospital',
      type: 'hospital',
      address: 'Main Road, City Center',
      phone: '+91-40-1234-5678',
      hours: '24/7',
      lat: 17.3850,
      lng: 78.4867
    },
    {
      id: '2',
      name: 'Primary Health Center',
      type: 'clinic',
      address: 'Village Road, Suburb',
      phone: '+91-40-2345-6789',
      hours: '9:00 AM - 6:00 PM',
      lat: 17.3900,
      lng: 78.4900
    },
    {
      id: '3',
      name: 'Apollo Pharmacy',
      type: 'pharmacy',
      address: 'Commercial Street',
      phone: '+91-40-3456-7890',
      hours: '8:00 AM - 10:00 PM',
      lat: 17.3800,
      lng: 78.4800
    },
    {
      id: '4',
      name: 'Emergency Medical Services',
      type: 'emergency',
      address: 'Emergency Response Unit',
      phone: '108',
      hours: '24/7',
      lat: 17.3750,
      lng: 78.4750
    },
    {
      id: '5',
      name: 'Community Health Clinic',
      type: 'clinic',
      address: 'Community Center, Block A',
      phone: '+91-40-4567-8901',
      hours: '10:00 AM - 5:00 PM',
      lat: 17.3950,
      lng: 78.4950
    },
    {
      id: '6',
      name: 'MedPlus Pharmacy',
      type: 'pharmacy',
      address: 'Market Square',
      phone: '+91-40-5678-9012',
      hours: '7:00 AM - 11:00 PM',
      lat: 17.3700,
      lng: 78.4700
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setServices(sampleServices);
      setFilteredServices(sampleServices);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(service => service.type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map(service => ({
        ...service,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          service.lat,
          service.lng
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setFilteredServices(filtered);
  }, [services, selectedType, searchQuery, userLocation]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleLocationFound = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Hospital className="h-5 w-5" />;
      case 'clinic': return <Stethoscope className="h-5 w-5" />;
      case 'pharmacy': return <Pill className="h-5 w-5" />;
      case 'emergency': return <AlertTriangle className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'text-red-600 bg-red-100';
      case 'clinic': return 'text-blue-600 bg-blue-100';
      case 'pharmacy': return 'text-green-600 bg-green-100';
      case 'emergency': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const createCustomIcon = (type: string) => {
    const colors = {
      hospital: '#dc2626',
      clinic: '#2563eb',
      pharmacy: '#16a34a',
      emergency: '#ea580c'
    };
    
    const color = colors[type as keyof typeof colors] || '#6b7280';
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });
  };

  const handleCallService = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleGetDirections = (lat: number, lng: number) => {
    if (userLocation) {
      const url = `https://www.openstreetmap.org/directions?from=${userLocation.lat},${userLocation.lng}&to=${lat},${lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-600 rounded-full p-3">
            <MapPin className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('findHelp.title')}
        </h2>
        <p className="text-gray-600">
          {t('findHelp.subtitle')}
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('findHelp.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent"
          >
            <option value="all">{t('findHelp.allServices')}</option>
            <option value="hospital">{t('findHelp.hospitals')}</option>
            <option value="clinic">{t('findHelp.clinics')}</option>
            <option value="pharmacy">{t('findHelp.pharmacies')}</option>
            <option value="emergency">{t('findHelp.emergency')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="order-2 lg:order-1">
          <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {typeof window !== 'undefined' && (
              <MapContainer
                center={userLocation || [17.3850, 78.4867]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <LocationComponent onLocationFound={handleLocationFound} />
                
                {filteredServices.map((service) => (
                  <Marker
                    key={service.id}
                    position={[service.lat, service.lng]}
                    icon={createCustomIcon(service.type)}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{service.address}</p>
                        {service.phone && (
                          <p className="text-sm text-gray-600 mb-1">
                            <Phone className="inline h-3 w-3 mr-1" />
                            {service.phone}
                          </p>
                        )}
                        {service.hours && (
                          <p className="text-sm text-gray-600 mb-2">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {service.hours}
                          </p>
                        )}
                        <div className="flex space-x-2">
                          {service.phone && (
                            <button
                              onClick={() => handleCallService(service.phone!)}
                              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                            >
                              {t('findHelp.call')}
                            </button>
                          )}
                          <button
                            onClick={() => handleGetDirections(service.lat, service.lng)}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            {t('findHelp.directions')}
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Services List */}
        <div className="order-1 lg:order-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('findHelp.nearbyServices')} ({filteredServices.length})
          </h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2b7a78] mx-auto mb-2" />
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredServices.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">{t('findHelp.noServicesFound')}</p>
                </div>
              ) : (
                filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getServiceColor(service.type)}`}>
                          {getServiceIcon(service.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {t(`findHelp.serviceTypes.${service.type}`)}
                          </p>
                        </div>
                      </div>
                      {service.distance && (
                        <span className="text-sm text-gray-500">
                          {service.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{service.address}</p>
                    
                    {service.phone && (
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {service.phone}
                      </p>
                    )}
                    
                    {service.hours && (
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.hours}
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      {service.phone && (
                        <button
                          onClick={() => handleCallService(service.phone!)}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{t('findHelp.call')}</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleGetDirections(service.lat, service.lng)}
                        className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      >
                        <Navigation className="h-3 w-3" />
                        <span>{t('findHelp.directions')}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 mb-2 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {t('findHelp.emergencyNumbers')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-red-700">{t('findHelp.ambulance')}</p>
            <p className="text-red-600">108</p>
          </div>
          <div>
            <p className="font-medium text-red-700">{t('findHelp.police')}</p>
            <p className="text-red-600">100</p>
          </div>
          <div>
            <p className="font-medium text-red-700">{t('findHelp.fire')}</p>
            <p className="text-red-600">101</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindHelp;