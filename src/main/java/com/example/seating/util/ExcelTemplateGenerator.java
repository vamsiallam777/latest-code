package com.example.seating.util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class ExcelTemplateGenerator {
    
    public ByteArrayInputStream generateStudentTemplate() throws IOException {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Students Template");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            Cell headerCell = headerRow.createCell(0);
            headerCell.setCellValue("Name");
            headerCell.setCellStyle(headerStyle);
            
            headerCell = headerRow.createCell(1);
            headerCell.setCellValue("Email");
            headerCell.setCellStyle(headerStyle);
            
            headerCell = headerRow.createCell(2);
            headerCell.setCellValue("Registration Number");
            headerCell.setCellStyle(headerStyle);
            
            headerCell = headerRow.createCell(3);
            headerCell.setCellValue("Phone Number");
            headerCell.setCellStyle(headerStyle);
            
            // Create example row
            Row exampleRow = sheet.createRow(1);
            exampleRow.createCell(0).setCellValue("John Doe");
            exampleRow.createCell(1).setCellValue("john.doe@example.com");
            exampleRow.createCell(2).setCellValue("REG123456");
            exampleRow.createCell(3).setCellValue("1234567890");
            
            // Auto size columns
            for (int i = 0; i < 4; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}