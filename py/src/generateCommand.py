def generate_filename(current_ctlfilename):
    templist = current_ctlfilename.split('_')
    date = templist[5]
    curr_ncfilename = 'rain' + date + '.nc'
    curr_year = int(date[:4])
    curr_month = int(date[4:])
    if curr_month == 12:
        next_month = '01'
        next_year = str(curr_year + 1)
    else:
        next_month = str(curr_month + 1)
        next_year = str(curr_year)
    if len(next_month) == 1:
        next_month = '0' + next_month
    templist[5] = next_year + next_month
    next_ctlfilename = ''
    for i in templist:
        next_ctlfilename += (i + '_')
    next_ctlfilename = next_ctlfilename[:-1]
    return curr_ncfilename, next_ctlfilename


def generate_command(current_ctlfilename):
    with open('./commandFile.txt', 'w') as f:
        for i in xrange(601):
            '''
            open surf_HFB_4K_CC_m101_209209_rain_subset.ctl
            set lon 135.6 135.8
            set lat 34.8 35.2
            set t 1 last
            define rain = rain
            set sdfwrite rain209209.nc
            sdfwrite rain
            close 1
            '''
            curr_ncfilename, next_ctlfilename = generate_filename(
                current_ctlfilename)
            f.write('open ' + current_ctlfilename + '\n')
            f.write('set lon 135.6 135.8\n')
            f.write('set lat 34.8 35.2\n')
            f.write('set t 1 last\n')
            f.write('define rain = rain\n')
            f.write('set sdfwrite ../netcdf/' + curr_ncfilename + '\n')
            f.write('sdfwrite rain\n')
            current_ctlfilename = next_ctlfilename


if __name__ == '__main__':
    '''
    terminal: cd to ../asset/m101/
    '''
    current_ctlfilename = 'surf_HFB_4K_CC_m101_205009_rain_subset.ctl'
    generate_command(current_ctlfilename)
