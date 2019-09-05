FROM ubuntu:latest

RUN apt-get update \
  && apt-get install -y gcc autoconf libtool swig python3-dev \
  python3-pip python3-pyaudio git bison build-essential \
  libasound2-dev libpulse-dev pulseaudio \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# RUN git clone https://github.com/cmusphinx/sphinxbase.git \
#   && cd sphinxbase \
#   && ./autogen.sh \
#   && ./configure \
#   && make \
#   && make install

# ENV LD_LIBRARY_PATH="/usr/local/lib"
# ENV PKG_CONFIG_PATH="/usr/local/lib/pkgconfig"

# RUN git clone https://github.com/cmusphinx/pocketsphinx.git --progress
# RUN cd pocketsphinx \
#   && ./autogen.sh \
#   && ./configure \
#   && make clean all \
#   && make install

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

WORKDIR /src
