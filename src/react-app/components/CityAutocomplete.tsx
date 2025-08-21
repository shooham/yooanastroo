import { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// Popular cities dataset - can be expanded
const POPULAR_CITIES = [
  'Mumbai, Maharashtra, India',
  'Delhi, Delhi, India',
  'Bangalore, Karnataka, India',
  'Hyderabad, Telangana, India',
  'Chennai, Tamil Nadu, India',
  'Kolkata, West Bengal, India',
  'Pune, Maharashtra, India',
  'Ahmedabad, Gujarat, India',
  'Jaipur, Rajasthan, India',
  'Surat, Gujarat, India',
  'Lucknow, Uttar Pradesh, India',
  'Kanpur, Uttar Pradesh, India',
  'Nagpur, Maharashtra, India',
  'Indore, Madhya Pradesh, India',
  'Thane, Maharashtra, India',
  'Bhopal, Madhya Pradesh, India',
  'Visakhapatnam, Andhra Pradesh, India',
  'Pimpri-Chinchwad, Maharashtra, India',
  'Patna, Bihar, India',
  'Vadodara, Gujarat, India',
  'Ghaziabad, Uttar Pradesh, India',
  'Ludhiana, Punjab, India',
  'Agra, Uttar Pradesh, India',
  'Nashik, Maharashtra, India',
  'Faridabad, Haryana, India',
  'Meerut, Uttar Pradesh, India',
  'Rajkot, Gujarat, India',
  'Kalyan-Dombivli, Maharashtra, India',
  'Vasai-Virar, Maharashtra, India',
  'Varanasi, Uttar Pradesh, India',
  'Srinagar, Jammu and Kashmir, India',
  'Aurangabad, Maharashtra, India',
  'Dhanbad, Jharkhand, India',
  'Amritsar, Punjab, India',
  'Navi Mumbai, Maharashtra, India',
  'Allahabad, Uttar Pradesh, India',
  'Ranchi, Jharkhand, India',
  'Howrah, West Bengal, India',
  'Coimbatore, Tamil Nadu, India',
  'Jabalpur, Madhya Pradesh, India',
  'Gwalior, Madhya Pradesh, India',
  'Vijayawada, Andhra Pradesh, India',
  'Jodhpur, Rajasthan, India',
  'Madurai, Tamil Nadu, India',
  'Raipur, Chhattisgarh, India',
  'Kota, Rajasthan, India',
  'Chandigarh, Chandigarh, India',
  'Guwahati, Assam, India',
  'Solapur, Maharashtra, India',
  'Hubli-Dharwad, Karnataka, India',
  'Bareilly, Uttar Pradesh, India',
  'Moradabad, Uttar Pradesh, India',
  'Mysore, Karnataka, India',
  'Gurgaon, Haryana, India',
  'Aligarh, Uttar Pradesh, India',
  'Jalandhar, Punjab, India',
  'Tiruchirappalli, Tamil Nadu, India',
  'Bhubaneswar, Odisha, India',
  'Salem, Tamil Nadu, India',
  'Warangal, Telangana, India',
  'Guntur, Andhra Pradesh, India',
  'Bhiwandi, Maharashtra, India',
  'Saharanpur, Uttar Pradesh, India',
  'Gorakhpur, Uttar Pradesh, India',
  'Bikaner, Rajasthan, India',
  'Amravati, Maharashtra, India',
  'Noida, Uttar Pradesh, India',
  'Jamshedpur, Jharkhand, India',
  'Bhilai, Chhattisgarh, India',
  'Cuttack, Odisha, India',
  'Firozabad, Uttar Pradesh, India',
  'Kochi, Kerala, India',
  'Nellore, Andhra Pradesh, India',
  'Bhavnagar, Gujarat, India',
  'Dehradun, Uttarakhand, India',
  'Durgapur, West Bengal, India',
  'Asansol, West Bengal, India',
  'Rourkela, Odisha, India',
  'Nanded, Maharashtra, India',
  'Kolhapur, Maharashtra, India',
  'Ajmer, Rajasthan, India',
  'Akola, Maharashtra, India',
  'Gulbarga, Karnataka, India',
  'Jamnagar, Gujarat, India',
  'Ujjain, Madhya Pradesh, India',
  'Loni, Uttar Pradesh, India',
  'Siliguri, West Bengal, India',
  'Jhansi, Uttar Pradesh, India',
  'Ulhasnagar, Maharashtra, India',
  'Jammu, Jammu and Kashmir, India',
  'Sangli-Miraj & Kupwad, Maharashtra, India',
  'Mangalore, Karnataka, India',
  'Erode, Tamil Nadu, India',
  'Belgaum, Karnataka, India',
  'Ambattur, Tamil Nadu, India',
  'Tirunelveli, Tamil Nadu, India',
  'Malegaon, Maharashtra, India',
  'Gaya, Bihar, India',
  'Jalgaon, Maharashtra, India',
  'Udaipur, Rajasthan, India',
  'Maheshtala, West Bengal, India',
  // International cities
  'New York, NY, USA',
  'Los Angeles, CA, USA',
  'Chicago, IL, USA',
  'Houston, TX, USA',
  'Phoenix, AZ, USA',
  'Philadelphia, PA, USA',
  'San Antonio, TX, USA',
  'San Diego, CA, USA',
  'Dallas, TX, USA',
  'San Jose, CA, USA',
  'London, England, UK',
  'Birmingham, England, UK',
  'Manchester, England, UK',
  'Glasgow, Scotland, UK',
  'Liverpool, England, UK',
  'Leeds, England, UK',
  'Sheffield, England, UK',
  'Edinburgh, Scotland, UK',
  'Bristol, England, UK',
  'Leicester, England, UK',
  'Toronto, Ontario, Canada',
  'Montreal, Quebec, Canada',
  'Vancouver, British Columbia, Canada',
  'Calgary, Alberta, Canada',
  'Edmonton, Alberta, Canada',
  'Ottawa, Ontario, Canada',
  'Winnipeg, Manitoba, Canada',
  'Quebec City, Quebec, Canada',
  'Hamilton, Ontario, Canada',
  'Kitchener, Ontario, Canada',
  'Sydney, New South Wales, Australia',
  'Melbourne, Victoria, Australia',
  'Brisbane, Queensland, Australia',
  'Perth, Western Australia, Australia',
  'Adelaide, South Australia, Australia',
  'Gold Coast, Queensland, Australia',
  'Canberra, Australian Capital Territory, Australia',
  'Newcastle, New South Wales, Australia',
  'Wollongong, New South Wales, Australia',
  'Geelong, Victoria, Australia',
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Sharjah, UAE',
  'Ajman, UAE',
  'Ras Al Khaimah, UAE',
  'Fujairah, UAE',
  'Al Ain, UAE',
  'Singapore, Singapore',
  'Kuala Lumpur, Malaysia',
  'George Town, Malaysia',
  'Johor Bahru, Malaysia',
  'Ipoh, Malaysia',
  'Shah Alam, Malaysia',
  'Petaling Jaya, Malaysia',
  'Seremban, Malaysia',
  'Kuching, Malaysia',
  'Kota Kinabalu, Malaysia',
  'Melaka, Malaysia'
];

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = "Enter your birth city",
  required = false,
  className = ""
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleCitySelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleCitySelect(filteredCities[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    if (value.length >= 2 && filteredCities.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicking on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          required={required}
          className="w-full pl-12 pr-10 py-3 bg-transparent border border-white/10 rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-300"
          autoComplete="off"
        />
        
        {/* Map Pin Icon */}
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
        
        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* Dropdown */}
      {isOpen && filteredCities.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-2 bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-lg shadow-[var(--shadow)] max-h-64 overflow-y-auto"
        >
          {filteredCities.map((city, index) => {
            const [cityName, state, country] = city.split(', ');
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleCitySelect(city)}
                className={`w-full text-left px-4 py-3 hover:bg-[var(--accent)]/10 transition-colors duration-200 border-b border-white/5 last:border-b-0 ${
                  index === highlightedIndex ? 'bg-[var(--accent)]/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  <div>
                    <div className="text-[var(--text)] font-medium">{cityName}</div>
                    <div className="text-[var(--muted)] text-sm">{state}, {country}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {isOpen && value.length >= 2 && filteredCities.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-lg shadow-[var(--shadow)] p-4 text-center">
          <div className="text-[var(--muted)] text-sm">
            No cities found. You can still enter your city manually.
          </div>
        </div>
      )}
    </div>
  );
}
