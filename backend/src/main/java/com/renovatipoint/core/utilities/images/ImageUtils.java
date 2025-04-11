package com.renovatipoint.core.utilities.images;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

public class ImageUtils {

    public static byte[] compressImage(byte[] data) {
        if (data == null || data.length == 0) {
            return new byte[0];
        }

        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4 * 1024];

        try {
            while (!deflater.finished()) {
                int size = deflater.deflate(tmp);
                outputStream.write(tmp, 0, size);
            }
            outputStream.close();
        } catch (IOException e) {
            // Hata durumunda orijinal veriyi döndür
            return data;
        } finally {
            deflater.end();
        }

        return outputStream.toByteArray();
    }

    public static byte[] decompressImage(byte[] data) {
        if (data == null || data.length == 0) {
            return new byte[0];
        }

        Inflater inflater = new Inflater();
        inflater.setInput(data);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4 * 1024];

        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(tmp);
                outputStream.write(tmp, 0, count);
            }
            outputStream.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            // Hata durumunda orijinal veriyi döndür
            return data;
        } finally {
            inflater.end();
        }
    }
}
