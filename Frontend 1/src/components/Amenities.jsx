import React from 'react';
import {
  Wifi,
  Monitor,
  Presentation,
  Speaker,
  Cable,
  MicVocal,
  PencilRuler
} from 'lucide-react';
import { Icon } from 'lucide-react';
import { chairsTablePlatter } from '@lucide/lab';

function Amenities({ availableAmenities = {} }) {


  return (
    <div className="grid grid-cols-2 gap-4 ">
  {availableAmenities.wifi && (
    <Amenity icon={<Wifi className="w-3 h-3 text-blue-600" />} label="Wifi" />
  )}
  {availableAmenities.tv && (
    <Amenity icon={<Monitor className="w-3 h-3 text-blue-600" />} label="TV/Monitor" />
  )}
  {availableAmenities.speaker && (
    <Amenity icon={<Speaker className="w-3 h-3 text-blue-600" />} label="Speakers" />
  )}
  {availableAmenities.mic && (
    <Amenity icon={<MicVocal className="w-3 h-3 text-blue-600" />} label="Mic" />
  )}
  {availableAmenities.whiteboard && (
    <Amenity icon={<Presentation className="w-3 h-3 text-blue-600" />} label="White Board" />
  )}
  {availableAmenities.stationaries && (
    <Amenity icon={<PencilRuler className="w-3 h-3 text-blue-600" />} label="Stationaries" />
  )}
  {availableAmenities.chairs_tables && (
    <Amenity
      icon={<Icon iconNode={chairsTablePlatter} className="w-3 h-3 text-blue-600" />}
      label="Chairs & Tables"
    />
  )}
  {availableAmenities.extension_power_box && (
    <Amenity icon={<Cable className="w-3 h-3 text-blue-600" />} label="Power Extension Box" />
  )}
</div>

    // <div className="grid grid-cols-2 gap-4">
    //   {availableAmenities.wifi && (
    //     <Amenity icon={<Wifi className="w-5 h-5 text-blue-600" />} label="Wifi" />
    //   )}
    //   {availableAmenities.tv && (
    //     <Amenity icon={<Monitor className="w-5 h-5 text-blue-600" />} label="TV/Monitor" />
    //   )}
    //   {availableAmenities.speaker && (
    //     <Amenity icon={<Speaker className="w-5 h-5 text-blue-600" />} label="Speakers" />
    //   )}
    //   {availableAmenities.mic && (
    //     <Amenity icon={<MicVocal className="w-5 h-5 text-blue-600" />} label="Mic" />
    //   )}
    //   {availableAmenities.whiteboard && (
    //     <Amenity icon={<Presentation className="w-5 h-5 text-blue-600" />} label="White Board" />
    //   )}
    //   {availableAmenities.stationaries && (
    //     <Amenity icon={<PencilRuler className="w-5 h-5 text-blue-600" />} label="Stationaries" />
    //   )}
    //   {availableAmenities.chairs_tables && (
    //     <Amenity
    //       icon={<Icon iconNode={chairsTablePlatter} className="w-5 h-5 text-blue-600" />}
    //       label="Chairs & Tables"
    //     />
    //   )}
    //   {availableAmenities.extension_power_box && (
    //     <Amenity icon={<Cable className="w-5 h-5 text-blue-600" />} label="Power Extension Box" />
    //   )}
    // </div>
  );
}

function Amenity({ icon, label }) {


  return (
    <div className="flex items-center transition duration-300 border-none rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:ring-blue-700/20">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
      </div>
    </div>
  );
}

export default Amenities;
