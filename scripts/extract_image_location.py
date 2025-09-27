#!/usr/bin/env python3
"""
extract_image_location.py

Extract GPS (location) information from an image's EXIF metadata.
Optionally reverse-geocode with Nominatim (OpenStreetMap).

Usage:
    python extract_image_location.py /path/to/image.jpg
    python extract_image_location.py /path/to/image.jpg --reverse

Dependencies:
    pip install exifread requests
"""

import exifread
import argparse
import requests
from typing import Optional, Tuple


def _rational_to_float(rat):
    # exifread returns rationals as exifread.utils.Ratio objects
    try:
        return float(rat.num) / float(rat.den)
    except Exception:
        # fall back if it's already a float/int
        return float(rat)


def _dms_to_decimal(dms, ref) -> Optional[float]:
    """
    dms: list/tuple of 3 rationals (deg, min, sec)
    ref: 'N', 'S', 'E', 'W'
    """
    try:
        deg = _rational_to_float(dms[0])
        minute = _rational_to_float(dms[1])
        sec = _rational_to_float(dms[2])
        dec = deg + (minute / 60.0) + (sec / 3600.0)
        if ref in ('S', 'W'):
            dec = -dec
        return dec
    except Exception:
        return None


def extract_gps_from_exif(filename: str) -> Tuple[Optional[float], Optional[float], Optional[float]]:
    """
    Returns (latitude, longitude, altitude) in decimal degrees/meters if present, else (None, None, None)
    """
    with open(filename, 'rb') as f:
        tags = exifread.process_file(f, details=True)
        print(tags)

    # Common GPS tags returned by exifread:
    # 'GPS GPSLatitude', 'GPS GPSLatitudeRef', 'GPS GPSLongitude', 'GPS GPSLongitudeRef', 'GPS GPSAltitude'
    lat = lon = alt = None

    lat_tag = tags.get('GPS GPSLatitude')
    lat_ref_tag = tags.get('GPS GPSLatitudeRef')
    lon_tag = tags.get('GPS GPSLongitude')
    lon_ref_tag = tags.get('GPS GPSLongitudeRef')
    alt_tag = tags.get('GPS GPSAltitude')
    alt_ref_tag = tags.get('GPS GPSAltitudeRef')  # 0 = above sea level, 1 = below

    if lat_tag and lat_ref_tag and lon_tag and lon_ref_tag:
        # lat_tag.values is list of Ratio objects
        lat = _dms_to_decimal(lat_tag.values, str(lat_ref_tag))
        lon = _dms_to_decimal(lon_tag.values, str(lon_ref_tag))

    if alt_tag:
        try:
            alt = _rational_to_float(alt_tag.values[0]) if hasattr(alt_tag.values, '__len__') else _rational_to_float(alt_tag.values)
            if alt_ref_tag and str(alt_ref_tag) == '1':
                alt = -alt
        except Exception:
            try:
                alt = float(str(alt_tag))
            except Exception:
                alt = None

    return lat, lon, alt


def reverse_geocode(lat: float, lon: float, email: Optional[str] = None) -> Optional[dict]:
    """
    Reverse geocode using Nominatim (OpenStreetMap). Provide a polite 'User-Agent' and optionally an email.
    Returns JSON dict from Nominatim or None on failure.
    Nominatim usage policy: don't send bulk requests; include contact info if possible.
    """
    url = "https://nominatim.openstreetmap.org/reverse"
    headers = {
        "User-Agent": "ImageLocationExtractor/1.0 (+https://example.com)",
    }
    params = {
        "format": "jsonv2",
        "lat": str(lat),
        "lon": str(lon),
        "addressdetails": 1,
    }
    if email:
        params['email'] = email

    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        # Could log error; return None
        return None


def main():
    parser = argparse.ArgumentParser(description="Extract GPS location (EXIF) from an image file.")
    parser.add_argument("image", help="Path to the image file")
    parser.add_argument("--reverse", action="store_true", help="Reverse-geocode coordinates to an address (uses Nominatim)")
    parser.add_argument("--email", default=None, help="Optional email to include in Nominatim requests (polite)")
    args = parser.parse_args()

    lat, lon, alt = extract_gps_from_exif(args.image)
    if lat is None or lon is None:
        print("No GPS EXIF data found in image.")
        return

    print(f"Coordinates (decimal):\n  Latitude:  {lat}\n  Longitude: {lon}")
    if alt is not None:
        print(f"  Altitude:  {alt} m")

    if args.reverse:
        print("\nReverse-geocoding (OpenStreetMap Nominatim)...")
        res = reverse_geocode(lat, lon, email=args.email)
        if not res:
            print("Reverse geocode failed or no result.")
        else:
            display_name = res.get("display_name")
            address = res.get("address", {})
            print("Address (display_name):", display_name)
            # Print key address components if available
            for key in ("road", "neighbourhood", "suburb", "city", "county", "state", "postcode", "country"):
                if key in address:
                    print(f"  {key.title():10s}: {address[key]}")

if __name__ == "__main__":
    main()
