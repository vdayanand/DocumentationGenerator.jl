var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "Readme",
    "title": "Readme",
    "category": "page",
    "text": ""
},

{
    "location": "#Ogg-1",
    "page": "Readme",
    "title": "Ogg",
    "category": "section",
    "text": "(Image: Build Status)Basic bindings to libogg to read Ogg bitstreams.  Basic operation is to use load() to read in an array of packets which can then be decoded by whatever higher-level codec can use them (such as Opus.jl), or use save() to write out a set of packets and their respective granule positions.  Manual use of this package is unusual, however if you are curious as to how .ogg files work, this package can act as a nice debugging tool.To look into details of an .ogg file such as its actual pages, you must keep track of the OggDecoder object so you can inspect its internal fields pages and packets.  The definition of load() is roughly equivalent to:dec = OggDecoder()\nOgg.decode_all_pages(dec, fio)\nOgg.decode_all_packets(dec, fio)Where fio is an IO object you wish to decode.  The fields dec.pages and dec.packets now contains much information about the .ogg file you have just decoded."
},

{
    "location": "autodocs/#Ogg.decode_all_packets-Tuple{OggDecoder,IO}",
    "page": "Docstrings",
    "title": "Ogg.decode_all_packets",
    "category": "method",
    "text": "File goes in, packets come out\n\n\n\n\n\n"
},

{
    "location": "autodocs/#Ogg.encode_all_packets-Tuple{OggEncoder,Dict{Int64,Array{Array{UInt8,1},1}},Dict{Int64,Array{Int64,1}}}",
    "page": "Docstrings",
    "title": "Ogg.encode_all_packets",
    "category": "method",
    "text": "encode_all_packets(enc, packets, granulepos)\n\nFeed all packets (with their corresponding granule positions) into encoder enc.\n\n\n\n\n\n"
},

{
    "location": "autodocs/#Ogg.ogg_stream_pagein-Tuple{OggDecoder,Ogg.OggPage}",
    "page": "Docstrings",
    "title": "Ogg.ogg_stream_pagein",
    "category": "method",
    "text": "Send a page in, return the serial number of the stream that we just decoded\n\n\n\n\n\n"
},

{
    "location": "autodocs/#",
    "page": "Docstrings",
    "title": "Docstrings",
    "category": "page",
    "text": "Package doesn\'t contain Documenter docs.Docs automatically generated by juliadocs.orgModules = [Ogg]\nOrder = [:type, :function]"
},

]}
