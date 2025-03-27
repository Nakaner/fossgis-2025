You can export the computed results using [Martin](https://maplibre.org/martin/introduction.html). For example, you can install it using Docker.
In this example `config_path` is the `martin` directory in this repository. It will be mounted as `/config` in the Docker container.
The directory `output_dir` will be mounted as `/output`.

```sh
export PGPASSWORD=your-secret-password
docker run -p 3000:3000    --net=host -e PGPASSWORD            -e DATABASE_URL=postgresql://michael:$PGPASSWORD@localhost/dach -v $(pwd)/martin:/config -v $(pwd)/vector_tiles:/output  ghcr.io/maplibre/martin --config /config/config.yaml
```

The example above requires access to the database without password via TCP/IP. See the [documentation of Martin](https://maplibre.org/martin/installation.html#docker) if your database requires a password (or you do not want to modify `pg_hba.conf`).

After starting the container, open a terminal in the container `docker container exec -it CONTAINER_ID /bin/sh` and execute the following command:

```sh
martin-cp --config config/config.yaml --source street_data --max-zoom 12 --output-file /output/tile_info.mbtiles --cache-size 10000 --concurrency 12 --bbox 5.36,45.63,17.35,55.31
```

Convert into individual tile files:

```sh
python3 mb-util --image_format=pbf vector_tiles/tile_info.mbtiles vector_tiles/tile_info
```
