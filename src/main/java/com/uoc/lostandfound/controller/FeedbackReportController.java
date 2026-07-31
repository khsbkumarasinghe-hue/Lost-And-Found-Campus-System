package com.uoc.lostandfound.controller;

import com.uoc.lostandfound.model.FeedbackReport;
import com.uoc.lostandfound.service.FeedbackReportService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback-reports")
@CrossOrigin(origins = "*")
public class FeedbackReportController {

    private final FeedbackReportService service;

    public FeedbackReportController(FeedbackReportService service) {
        this.service = service;
    }

    // create feedback
    @PostMapping
    public ResponseEntity<FeedbackReport> createFeedbackReport(
            @RequestBody FeedbackReport feedbackReport) {

        FeedbackReport savedReport =
                service.createFeedbackReport(feedbackReport);

        return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
    }

    // get all feedbacks
    @GetMapping
    public ResponseEntity<List<FeedbackReport>>
    getAllFeedbackReports() {

        return ResponseEntity.ok(
                service.getAllFeedbackReports()
        );
    }

    // read feedbacks one by one
    @GetMapping("/{id}")
    public ResponseEntity<FeedbackReport>
    getFeedbackReportById(@PathVariable Long id) {

        return service.getFeedbackReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // update feedbacks
    @PutMapping("/{id}")
    public ResponseEntity<FeedbackReport> updateFeedbackReport(
            @PathVariable Long id,
            @RequestBody FeedbackReport feedbackReport) {

        return service.updateFeedbackReport(id, feedbackReport)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // delete feedback
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeedbackReport(
            @PathVariable Long id) {

        boolean deleted =
                service.deleteFeedbackReport(id);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Feedback report not found");
        }

        return ResponseEntity.ok(
                "Feedback report deleted successfully"
        );
    }
}
