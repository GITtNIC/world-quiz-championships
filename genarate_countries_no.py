#!/usr/bin/env python3
import json
import os

# Get the script's directory to ensure paths work regardless of execution location
script_dir = os.path.dirname(os.path.abspath(__file__))

# Comprehensive mapping of ISO alpha-3 codes to country names, continents, and UN status
country_data = {
    # Afrika
    'DZA': {'name': 'Algerie', 'continent': 'Africa', 'status': 'official'},
    'AGO': {'name': 'Angola', 'continent': 'Africa', 'status': 'official'},
    'BEN': {'name': 'Benin', 'continent': 'Africa', 'status': 'official'},
    'BWA': {'name': 'Botswana', 'continent': 'Africa', 'status': 'official'},
    'BFA': {'name': 'Burkina Faso', 'continent': 'Africa', 'status': 'official'},
    'BDI': {'name': 'Burundi', 'continent': 'Africa', 'status': 'official'},
    'CPV': {'name': 'Kapp Verde', 'continent': 'Africa', 'status': 'official'},
    'CAF': {'name': 'Den sentralafrikanske republikk', 'continent': 'Africa', 'status': 'official'},
    'TCD': {'name': 'Tsjad', 'continent': 'Africa', 'status': 'official'},
    'COM': {'name': 'Komorene', 'continent': 'Africa', 'status': 'official'},
    'COG': {'name': 'Republikken Kongo', 'continent': 'Africa', 'status': 'official'},
    'COD': {'name': 'Den demokratiske republikken Kongo', 'continent': 'Africa', 'status': 'official'},
    'CIV': {'name': 'Elfenbenskysten', 'continent': 'Africa', 'status': 'official'},
    'CMR': {'name': 'Kamerun', 'continent': 'Africa', 'status': 'official'},
    'DJI': {'name': 'Djibouti', 'continent': 'Africa', 'status': 'official'},
    'EGY': {'name': 'Egypt', 'continent': 'Africa', 'status': 'official'},
    'GNQ': {'name': 'Ekvatorial-Guinea', 'continent': 'Africa', 'status': 'official'},
    'ERI': {'name': 'Eritrea', 'continent': 'Africa', 'status': 'official'},
    'SWZ': {'name': 'Eswatini', 'continent': 'Africa', 'status': 'official'},
    'ETH': {'name': 'Etiopia', 'continent': 'Africa', 'status': 'official'},
    'GAB': {'name': 'Gabon', 'continent': 'Africa', 'status': 'official'},
    'GMB': {'name': 'Gambia', 'continent': 'Africa', 'status': 'official'},
    'GHA': {'name': 'Ghana', 'continent': 'Africa', 'status': 'official'},
    'GIN': {'name': 'Guinea', 'continent': 'Africa', 'status': 'official'},
    'GNB': {'name': 'Guinea-Bissau', 'continent': 'Africa', 'status': 'official'},
    'KEN': {'name': 'Kenya', 'continent': 'Africa', 'status': 'official'},
    'LSO': {'name': 'Lesotho', 'continent': 'Africa', 'status': 'official'},
    'LBR': {'name': 'Liberia', 'continent': 'Africa', 'status': 'official'},
    'LBY': {'name': 'Libya', 'continent': 'Africa', 'status': 'official'},
    'MDG': {'name': 'Madagaskar', 'continent': 'Africa', 'status': 'official'},
    'MWI': {'name': 'Malawi', 'continent': 'Africa', 'status': 'official'},
    'MLI': {'name': 'Mali', 'continent': 'Africa', 'status': 'official'},
    'MRT': {'name': 'Mauritania', 'continent': 'Africa', 'status': 'official'},
    'MUS': {'name': 'Mauritius', 'continent': 'Africa', 'status': 'official'},
    'MYT': {'name': 'Mayotte', 'continent': 'Africa', 'status': 'territory'},
    'MAR': {'name': 'Marokko', 'continent': 'Africa', 'status': 'official'},
    'MOZ': {'name': 'Mosambik', 'continent': 'Africa', 'status': 'official'},
    'NAM': {'name': 'Namibia', 'continent': 'Africa', 'status': 'official'},
    'NER': {'name': 'Niger', 'continent': 'Africa', 'status': 'official'},
    'NGA': {'name': 'Nigeria', 'continent': 'Africa', 'status': 'official'},
    'REU': {'name': 'Réunion', 'continent': 'Africa', 'status': 'territory'},
    'RWA': {'name': 'Rwanda', 'continent': 'Africa', 'status': 'official'},
    'SHN': {'name': 'St. Helena, Ascension og Tristan da Cunha', 'continent': 'Africa', 'status': 'territory'},
    'STP': {'name': 'São Tomé og Príncipe', 'continent': 'Africa', 'status': 'official'},
    'SEN': {'name': 'Senegal', 'continent': 'Africa', 'status': 'official'},
    'SYC': {'name': 'Seychellene', 'continent': 'Africa', 'status': 'official'},
    'SLE': {'name': 'Sierra Leone', 'continent': 'Africa', 'status': 'official'},
    'SOM': {'name': 'Somalia', 'continent': 'Africa', 'status': 'official'},
    'ZAF': {'name': 'Sør-Afrika', 'continent': 'Africa', 'status': 'official'},
    'SSD': {'name': 'Sør-Sudan', 'continent': 'Africa', 'status': 'official'},
    'SDN': {'name': 'Sudan', 'continent': 'Africa', 'status': 'official'},
    'TZA': {'name': 'Tanzania', 'continent': 'Africa', 'status': 'official'},
    'TGO': {'name': 'Togo', 'continent': 'Africa', 'status': 'official'},
    'TUN': {'name': 'Tunisia', 'continent': 'Africa', 'status': 'official'},
    'UGA': {'name': 'Uganda', 'continent': 'Africa', 'status': 'official'},
    'ZMB': {'name': 'Zambia', 'continent': 'Africa', 'status': 'official'},
    'ZWE': {'name': 'Zimbabwe', 'continent': 'Africa', 'status': 'official'},

    # Asia
    'AFG': {'name': 'Afghanistan', 'continent': 'Asia', 'status': 'official'},
    'ARE': {'name': 'De forente arabiske emirater', 'continent': 'Asia', 'status': 'official'},
    'ARM': {'name': 'Armenia', 'continent': 'Asia', 'status': 'official'},
    'AZE': {'name': 'Aserbajdsjan', 'continent': 'Asia', 'status': 'official'},
    'BGD': {'name': 'Bangladesh', 'continent': 'Asia', 'status': 'official'},
    'BHR': {'name': 'Bahrain', 'continent': 'Asia', 'status': 'official'},
    'BRN': {'name': 'Brunei', 'continent': 'Asia', 'status': 'official'},
    'BTN': {'name': 'Bhutan', 'continent': 'Asia', 'status': 'official'},
    'KHM': {'name': 'Kambodsja', 'continent': 'Asia', 'status': 'official'},
    'CHN': {'name': 'Kina', 'continent': 'Asia', 'status': 'official'},
    'CXR': {'name': 'Christmasøya', 'continent': 'Asia', 'status': 'territory'},
    'CCK': {'name': 'Kokosøyene', 'continent': 'Asia', 'status': 'territory'},
    'GEO': {'name': 'Georgia', 'continent': 'Asia', 'status': 'official'},
    'HKG': {'name': 'Hongkong', 'continent': 'Asia', 'status': 'territory'},
    'IND': {'name': 'India', 'continent': 'Asia', 'status': 'official'},
    'IDN': {'name': 'Indonesia', 'continent': 'Asia', 'status': 'official'},
    'IRN': {'name': 'Iran', 'continent': 'Asia', 'status': 'official'},
    'IRQ': {'name': 'Irak', 'continent': 'Asia', 'status': 'official'},
    'ISR': {'name': 'Israel', 'continent': 'Asia', 'status': 'official'},
    'JOR': {'name': 'Jordan', 'continent': 'Asia', 'status': 'official'},
    'JPN': {'name': 'Japan', 'continent': 'Asia', 'status': 'official'},
    'KAZ': {'name': 'Kasakhstan', 'continent': 'Asia', 'status': 'official'},
    'KWT': {'name': 'Kuwait', 'continent': 'Asia', 'status': 'official'},
    'KGZ': {'name': 'Kirgisistan', 'continent': 'Asia', 'status': 'official'},
    'LAO': {'name': 'Laos', 'continent': 'Asia', 'status': 'official'},
    'LBN': {'name': 'Libanon', 'continent': 'Asia', 'status': 'official'},
    'MAC': {'name': 'Macao', 'continent': 'Asia', 'status': 'territory'},
    'MYS': {'name': 'Malaysia', 'continent': 'Asia', 'status': 'official'},
    'MDV': {'name': 'Maldivene', 'continent': 'Asia', 'status': 'official'},
    'MNG': {'name': 'Mongolia', 'continent': 'Asia', 'status': 'official'},
    'MMR': {'name': 'Myanmar', 'continent': 'Asia', 'status': 'official'},
    'NPL': {'name': 'Nepal', 'continent': 'Asia', 'status': 'official'},
    'PRK': {'name': 'Nord-Korea', 'continent': 'Asia', 'status': 'official'},
    'OMN': {'name': 'Oman', 'continent': 'Asia', 'status': 'official'},
    'PAK': {'name': 'Pakistan', 'continent': 'Asia', 'status': 'official'},
    'PSE': {'name': 'Palestina', 'continent': 'Asia', 'status': 'observer'},
    'PHL': {'name': 'Filippinene', 'continent': 'Asia', 'status': 'official'},
    'QAT': {'name': 'Qatar', 'continent': 'Asia', 'status': 'official'},
    'SAU': {'name': 'Saudi-Arabia', 'continent': 'Asia', 'status': 'official'},
    'SGP': {'name': 'Singapore', 'continent': 'Asia', 'status': 'official'},
    'KOR': {'name': 'Sør-Korea', 'continent': 'Asia', 'status': 'official'},
    'LKA': {'name': 'Sri Lanka', 'continent': 'Asia', 'status': 'official'},
    'SYR': {'name': 'Syria', 'continent': 'Asia', 'status': 'official'},
    'TWN': {'name': 'Taiwan', 'continent': 'Asia', 'status': 'disputed'},
    'TJK': {'name': 'Tadsjikistan', 'continent': 'Asia', 'status': 'official'},
    'THA': {'name': 'Thailand', 'continent': 'Asia', 'status': 'official'},
    'TLS': {'name': 'Øst-Timor', 'continent': 'Asia', 'status': 'official'},
    'TKM': {'name': 'Turkmenistan', 'continent': 'Asia', 'status': 'official'},
    'TUR': {'name': 'Tyrkia', 'continent': 'Asia', 'status': 'official'},
    'UZB': {'name': 'Usbekistan', 'continent': 'Asia', 'status': 'official'},
    'VNM': {'name': 'Vietnam', 'continent': 'Asia', 'status': 'official'},
    'YEM': {'name': 'Jemen', 'continent': 'Asia', 'status': 'official'},

    # Europa
    'ALA': {'name': 'Åland', 'continent': 'Europe', 'status': 'territory'},
    'ALB': {'name': 'Albania', 'continent': 'Europe', 'status': 'official'},
    'AND': {'name': 'Andorra', 'continent': 'Europe', 'status': 'official'},
    'AUT': {'name': 'Østerrike', 'continent': 'Europe', 'status': 'official'},
    'BLR': {'name': 'Hviterussland', 'continent': 'Europe', 'status': 'official'},
    'BEL': {'name': 'Belgia', 'continent': 'Europe', 'status': 'official'},
    'BIH': {'name': 'Bosnia-Hercegovina', 'continent': 'Europe', 'status': 'official'},
    'BGR': {'name': 'Bulgaria', 'continent': 'Europe', 'status': 'official'},
    'HRV': {'name': 'Kroatia', 'continent': 'Europe', 'status': 'official'},
    'CYP': {'name': 'Kypros', 'continent': 'Europe', 'status': 'official'},
    'CZE': {'name': 'Tsjekkia', 'continent': 'Europe', 'status': 'official'},
    'DNK': {'name': 'Danmark', 'continent': 'Europe', 'status': 'official'},
    'EST': {'name': 'Estland', 'continent': 'Europe', 'status': 'official'},
    'FIN': {'name': 'Finland', 'continent': 'Europe', 'status': 'official'},
    'FRA': {'name': 'Frankrike', 'continent': 'Europe', 'status': 'official'},
    'DEU': {'name': 'Tyskland', 'continent': 'Europe', 'status': 'official'},
    'GIB': {'name': 'Gibraltar', 'continent': 'Europe', 'status': 'territory'},
    'GRC': {'name': 'Hellas', 'continent': 'Europe', 'status': 'official'},
    'GGY': {'name': 'Guernsey', 'continent': 'Europe', 'status': 'territory'},
    'HUN': {'name': 'Ungarn', 'continent': 'Europe', 'status': 'official'},
    'ISL': {'name': 'Island', 'continent': 'Europe', 'status': 'official'},
    'IRL': {'name': 'Irland', 'continent': 'Europe', 'status': 'official'},
    'IMN': {'name': 'Man', 'continent': 'Europe', 'status': 'territory'},
    'ITA': {'name': 'Italia', 'continent': 'Europe', 'status': 'official'},
    'JEY': {'name': 'Jersey', 'continent': 'Europe', 'status': 'territory'},
    'LVA': {'name': 'Latvia', 'continent': 'Europe', 'status': 'official'},
    'LIE': {'name': 'Liechtenstein', 'continent': 'Europe', 'status': 'official'},
    'LTU': {'name': 'Litauen', 'continent': 'Europe', 'status': 'official'},
    'LUX': {'name': 'Luxembourg', 'continent': 'Europe', 'status': 'official'},
    'MLT': {'name': 'Malta', 'continent': 'Europe', 'status': 'official'},
    'MDA': {'name': 'Moldova', 'continent': 'Europe', 'status': 'official'},
    'MCO': {'name': 'Monaco', 'continent': 'Europe', 'status': 'official'},
    'MNE': {'name': 'Montenegro', 'continent': 'Europe', 'status': 'official'},
    'NLD': {'name': 'Nederland', 'continent': 'Europe', 'status': 'official'},
    'MKD': {'name': 'Nord-Makedonia', 'continent': 'Europe', 'status': 'official'},
    'NOR': {'name': 'Norge', 'continent': 'Europe', 'status': 'official'},
    'POL': {'name': 'Polen', 'continent': 'Europe', 'status': 'official'},
    'PRT': {'name': 'Portugal', 'continent': 'Europe', 'status': 'official'},
    'ROU': {'name': 'Romania', 'continent': 'Europe', 'status': 'official'},
    'RUS': {'name': 'Russland', 'continent': 'Europe', 'status': 'official'},
    'SMR': {'name': 'San Marino', 'continent': 'Europe', 'status': 'official'},
    'SRB': {'name': 'Serbia', 'continent': 'Europe', 'status': 'official'},
    'SVK': {'name': 'Slovakia', 'continent': 'Europe', 'status': 'official'},
    'SVN': {'name': 'Slovenia', 'continent': 'Europe', 'status': 'official'},
    'ESP': {'name': 'Spania', 'continent': 'Europe', 'status': 'official'},
    'SJM': {'name': 'Svalbard og Jan Mayen', 'continent': 'Europe', 'status': 'territory'},
    'SWE': {'name': 'Sverige', 'continent': 'Europe', 'status': 'official'},
    'CHE': {'name': 'Sveits', 'continent': 'Europe', 'status': 'official'},
    'UKR': {'name': 'Ukraina', 'continent': 'Europe', 'status': 'official'},
    'GBR': {'name': 'Storbritannia', 'continent': 'Europe', 'status': 'official'},
    'GRL': {'name': 'Grønland', 'continent': 'Europe', 'status': 'territory'},
    'VAT': {'name': 'Vatikanstaten', 'continent': 'Europe', 'status': 'observer'},

    # Nord-Amerika
    'ABW': {'name': 'Aruba', 'continent': 'North America', 'status': 'territory'},
    'AIA': {'name': 'Anguilla', 'continent': 'North America', 'status': 'territory'},
    'ATG': {'name': 'Antigua og Barbuda', 'continent': 'North America', 'status': 'official'},
    'BHS': {'name': 'Bahamas', 'continent': 'North America', 'status': 'official'},
    'BLM': {'name': 'Saint-Barthélemy', 'continent': 'North America', 'status': 'territory'},
    'BLZ': {'name': 'Belize', 'continent': 'North America', 'status': 'official'},
    'BMU': {'name': 'Bermuda', 'continent': 'North America', 'status': 'territory'},
    'BRB': {'name': 'Barbados', 'continent': 'North America', 'status': 'official'},
    'BES': {'name': 'Bonaire, Sint Eustatius og Saba', 'continent': 'North America', 'status': 'territory'},
    'CAN': {'name': 'Canada', 'continent': 'North America', 'status': 'official'},
    'CYM': {'name': 'Caymanøyene', 'continent': 'North America', 'status': 'territory'},
    'CRI': {'name': 'Costa Rica', 'continent': 'North America', 'status': 'official'},
    'CUB': {'name': 'Cuba', 'continent': 'North America', 'status': 'official'},
    'CUW': {'name': 'Curacao', 'continent': 'North America', 'status': 'territory'},
    'DMA': {'name': 'Dominica', 'continent': 'North America', 'status': 'official'},
    'DOM': {'name': 'Den dominikanske republikk', 'continent': 'North America', 'status': 'official'},
    'SLV': {'name': 'El Salvador', 'continent': 'North America', 'status': 'official'},
    'GLP': {'name': 'Guadeloupe', 'continent': 'North America', 'status': 'territory'},
    'GRD': {'name': 'Grenada', 'continent': 'North America', 'status': 'official'},
    'GTM': {'name': 'Guatemala', 'continent': 'North America', 'status': 'official'},
    'HTI': {'name': 'Haiti', 'continent': 'North America', 'status': 'official'},
    'HND': {'name': 'Honduras', 'continent': 'North America', 'status': 'official'},
    'JAM': {'name': 'Jamaica', 'continent': 'North America', 'status': 'official'},
    'MAF': {'name': 'Saint-Martin', 'continent': 'North America', 'status': 'territory'},
    'MEX': {'name': 'Mexico', 'continent': 'North America', 'status': 'official'},
    'MSR': {'name': 'Montserrat', 'continent': 'North America', 'status': 'territory'},
    'NIC': {'name': 'Nicaragua', 'continent': 'North America', 'status': 'official'},
    'PAN': {'name': 'Panama', 'continent': 'North America', 'status': 'official'},
    'PRI': {'name': 'Puerto Rico', 'continent': 'North America', 'status': 'territory'},
    'KNA': {'name': 'Saint Kitts og Nevis', 'continent': 'North America', 'status': 'official'},
    'LCA': {'name': 'Saint Lucia', 'continent': 'North America', 'status': 'official'},
    'SPM': {'name': 'Saint-Pierre og Miquelon', 'continent': 'North America', 'status': 'territory'},
    'VCT': {'name': 'Saint Vincent og Grenadinene', 'continent': 'North America', 'status': 'official'},
    'SXM': {'name': 'Sint Maarten', 'continent': 'North America', 'status': 'territory'},
    'TCA': {'name': 'Turks- og Caicosøyene', 'continent': 'North America', 'status': 'territory'},
    'TTO': {'name': 'Trinidad og Tobago', 'continent': 'North America', 'status': 'official'},
    'USA': {'name': 'USA', 'continent': 'North America', 'status': 'official'},
    'VGB': {'name': 'De britiske jomfruøyene', 'continent': 'North America', 'status': 'territory'},
    'VIR': {'name': 'De amerikanske jomfruøyene', 'continent': 'North America', 'status': 'territory'},
    'MTQ': {'name': 'Martinique', 'continent': 'North America', 'status': 'territory'},

    # Sør-Amerika
    'ARG': {'name': 'Argentina', 'continent': 'South America', 'status': 'official'},
    'BOL': {'name': 'Bolivia', 'continent': 'South America', 'status': 'official'},
    'BRA': {'name': 'Brasil', 'continent': 'South America', 'status': 'official'},
    'CHL': {'name': 'Chile', 'continent': 'South America', 'status': 'official'},
    'COL': {'name': 'Colombia', 'continent': 'South America', 'status': 'official'},
    'ECU': {'name': 'Ecuador', 'continent': 'South America', 'status': 'official'},
    'FLK': {'name': 'Falklandsøyene', 'continent': 'South America', 'status': 'territory'},
    'GUF': {'name': 'Fransk Guyana', 'continent': 'South America', 'status': 'territory'},
    'GUY': {'name': 'Guyana', 'continent': 'South America', 'status': 'official'},
    'PRY': {'name': 'Paraguay', 'continent': 'South America', 'status': 'official'},
    'PER': {'name': 'Peru', 'continent': 'South America', 'status': 'official'},
    'SUR': {'name': 'Surinam', 'continent': 'South America', 'status': 'official'},
    'URY': {'name': 'Uruguay', 'continent': 'South America', 'status': 'official'},
    'VEN': {'name': 'Venezuela', 'continent': 'South America', 'status': 'official'},

    # Oseania
    'ASM': {'name': 'Amerikansk Samoa', 'continent': 'Oceania', 'status': 'territory'},
    'AUS': {'name': 'Australia', 'continent': 'Oceania', 'status': 'official'},
    'COK': {'name': 'Cookøyene', 'continent': 'Oceania', 'status': 'territory'},
    'FJI': {'name': 'Fiji', 'continent': 'Oceania', 'status': 'official'},
    'FSM': {'name': 'Mikronesiaføderasjonen', 'continent': 'Oceania', 'status': 'official'},
    'GUM': {'name': 'Guam', 'continent': 'Oceania', 'status': 'territory'},
    'KIR': {'name': 'Kiribati', 'continent': 'Oceania', 'status': 'official'},
    'MHL': {'name': 'Marshalløyene', 'continent': 'Oceania', 'status': 'official'},
    'MNP': {'name': 'Nord-Marianene', 'continent': 'Oceania', 'status': 'territory'},
    'NCL': {'name': 'Ny-Caledonia', 'continent': 'Oceania', 'status': 'territory'},
    'NZL': {'name': 'New Zealand', 'continent': 'Oceania', 'status': 'official'},
    'NIU': {'name': 'Niue', 'continent': 'Oceania', 'status': 'territory'},
    'NFK': {'name': 'Norfolkøya', 'continent': 'Oceania', 'status': 'territory'},
    'NRU': {'name': 'Nauru', 'continent': 'Oceania', 'status': 'official'},
    'PLW': {'name': 'Palau', 'continent': 'Oceania', 'status': 'official'},
    'PNG': {'name': 'Papua Ny-Guinea', 'continent': 'Oceania', 'status': 'official'},
    'PCN': {'name': 'Pitcairnøyene', 'continent': 'Oceania', 'status': 'territory'},
    'WSM': {'name': 'Samoa', 'continent': 'Oceania', 'status': 'official'},
    'SLB': {'name': 'Salomonøyene', 'continent': 'Oceania', 'status': 'official'},
    'TKL': {'name': 'Tokelau', 'continent': 'Oceania', 'status': 'territory'},
    'TON': {'name': 'Tonga', 'continent': 'Oceania', 'status': 'official'},
    'TUV': {'name': 'Tuvalu', 'continent': 'Oceania', 'status': 'official'},
    'UMI': {'name': 'USAs ytre småøyer', 'continent': 'Oceania', 'status': 'territory'},
    'VUT': {'name': 'Vanuatu', 'continent': 'Oceania', 'status': 'official'},
    'WLF': {'name': 'Wallis og Futuna', 'continent': 'Oceania', 'status': 'territory'},
    'PYF': {'name': 'Fransk Polynesia', 'continent': 'Oceania', 'status': 'territory'},

    # Antarktis og spesielle regioner
    'ATA': {'name': 'Antarktis', 'continent': 'Antarctica', 'status': 'territory'},
    'ATF': {'name': 'De franske sørterritorier', 'continent': 'Africa', 'status': 'territory'},
    'BVT': {'name': 'Bouvetøya', 'continent': 'Atlantic Ocean', 'status': 'territory'},
    'HMD': {'name': 'Heard- og McDonaldøyene', 'continent': 'Indian Ocean', 'status': 'territory'},
    'IOT': {'name': 'Det britiske territoriet i Indiahavet', 'continent': 'Asia', 'status': 'territory'},
    'SGS': {'name': 'Sør-Georgia og Sør-Sandwichøyene', 'continent': 'South Atlantic', 'status': 'territory'},
    'ESH': {'name': 'Vest-Sahara', 'continent': 'Africa', 'status': 'disputed'},
    'FRO': {'name': 'Færøyene', 'continent': 'Europe', 'status': 'territory'},
}

# Get all flag files from the assets directory
flag_dir = os.path.join(script_dir, 'game-modes/geography-games/world-flag-championships/assets/flags/svg')
flag_files = [f.replace('.svg', '') for f in os.listdir(flag_dir) if f.endswith('.svg')]

# Build continents dictionary
continents = {}
countries = []

for code in flag_files:
    if code in country_data:
        country = country_data[code]
        countries.append({
            'id': code,
            'name': country['name'],
            'continent': country['continent'],
            'flagPath': f'assets/flags/svg/{code}.svg',
            'status': country['status']
        })

        continent = country['continent']
        if continent not in continents:
            continents[continent] = []
        continents[continent].append(code)

# Create final data structure
data = {
    'continents': continents,
    'countries': countries
}

# Write to countries.json
output_path = os.path.join(script_dir, 'game-modes/geography-games/world-flag-championships/data/countries_no.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Count statistics
official_count = sum(1 for c in countries if c['status'] == 'official')
territory_count = sum(1 for c in countries if c['status'] == 'territory')
observer_count = sum(1 for c in countries if c['status'] == 'observer')
disputed_count = sum(1 for c in countries if c['status'] == 'disputed')

print(f'Created {output_path} with {len(countries)} countries across {len(continents)} continents')
print(f'\nStatus breakdown:')
print(f'  Official UN members: {official_count}')
print(f'  Territories: {territory_count}')
print(f'  UN observers: {observer_count}')
print(f'  Disputed territories: {disputed_count}')

# Debug info
missing_flags = set(flag_files) - set(country_data.keys())
if missing_flags:
    print(f'\n⚠️  Missing countries for these flag codes: {sorted(missing_flags)[:10]}...')
