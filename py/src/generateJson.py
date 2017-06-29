from netCDF4 import Dataset
import numpy as np
import json


def convertToJson():
    '''
    In json file, dataset => (lat,lon):[year:[month: [day: [24]]]]
    '''
    dump_dictonary = {'34.8_135.6': {}, '34.8_135.8': {},
                      '35.0_135.6': {}, '35.0_135.8': {},
                      '35.2_135.6': {}, '35.2_135.8': {}}  # 6 keys
    # year_list = []  # 51 years
    # month_list = []  # about 12 months
    # day_list = []  # 24 values
    curr_date = '205101'
    while curr_date != '205512':
        current_ncfilename = '../asset/netcdf/rain' + curr_date + '.nc'
        dataset = Dataset(current_ncfilename, 'r')
        # properties = []
        # for i in dataset.variables:
        #     properties.append(i)  # lon, lat, time, rain
        lons = dataset.variables['lon'][:]
        lats = dataset.variables['lat'][:]
        times = dataset.variables['time'][:]
        values = dataset.variables['rain'][:]  # values.shapes = time,lat,lon
        # check date
        # basic info
        curr_year = int(curr_date[:4])
        curr_month = int(curr_date[4:])

        for lat in xrange(len(lats)):
            for lon in xrange(len(lons)):
                temp_month = []
                temp_day = []
                for hour in xrange(len(times)):
                    if float(values[hour][lat][lon]) is np.NaN:
                        temp_value = None
                    else:
                        temp_value = float(values[hour][lat][lon])
                    temp_day.append(temp_value)
                    if (hour + 1) % 24 == 0:
                        temp_month.append(temp_day)
                        temp_day = []
                lat_lon = str(lats[lat]) + '_' + str(lons[lon])
                dump_dictonary[lat_lon][curr_date] = temp_month
        if curr_month == 12:
            curr_month = 1
            curr_year += 1
        else:
            curr_month += 1
        curr_month = str(curr_month)
        curr_year = str(curr_year)
        if len(curr_month) == 1:
            curr_month = '0' + curr_month
        curr_date = curr_year + curr_month

    with open('../asset/json/dataset.json', 'w') as f:
        json.dump(dump_dictonary, f)


if __name__ == '__main__':
    convertToJson()
