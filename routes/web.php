<?php

use App\Http\Controllers\Mentor\AnalyticsController;
use App\Http\Controllers\Mentor\AssessmentController;
use App\Http\Controllers\Mentor\CertificateController;
use App\Http\Controllers\Mentor\Courses\CourseController as MentorCourseController;
use App\Http\Controllers\Enrollee\CourseController as EnrolleeCourseController;
use App\Http\Controllers\Enrollee\LessonController as EnrolleeLessonController;
use App\Http\Controllers\Mentor\Courses\CourseLessonMaterialController;
use App\Http\Controllers\Mentor\Courses\CourseLessonVideoController;
use App\Http\Controllers\Mentor\Courses\CourseMediaController;
use App\Http\Controllers\Mentor\Courses\CoursePricingController;
use App\Http\Controllers\Mentor\Courses\CourseReviewController;
use App\Http\Controllers\Mentor\Courses\CourseSyllabusController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Mentor\EnrolleeController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Verification\VerificationController;
use App\Http\Middleware\EnforceVerificationStepProgress;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

Route::redirect('/', '/login');

// OTP
Route::controller(OtpController::class)
    ->prefix('otp')
    ->name('otp.')
    ->group(function () {
        Route::get('/',          'create')->name('create');
        Route::post('/generate', 'generate')->name('generate');
        Route::post('/verify',   'verify')->name('verify');
    });

// Assessments
Route::controller(AssessmentController::class)
    ->prefix('assessment')
    ->name('assessment.')
    ->group(function () {
        Route::get('/',              'create')->name('create');
        Route::post('/',             'store')->name('store');
        Route::delete('/{assessment}','destroy')->name('destroy');
    });

// Enrollee public profile
Route::get('/enrollees/show/{id}', [EnrolleeController::class, 'show'])
    ->name('enrollee.show')
    ->whereNumber('id');

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */

    Route::controller(ProfileController::class)
        ->prefix('profile')
        ->name('profile.')
        ->group(function () {
            Route::get('/',    'edit')->name('edit');
            Route::patch('/',  'update')->name('update');
            Route::delete('/', 'destroy')->name('destroy');
        });

    /*
    |--------------------------------------------------------------------------
    | VERIFIED-ONLY ROUTES
    |--------------------------------------------------------------------------
    */

    Route::middleware('verified')->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // ─── Enrollee ────────────────────────────────────────────────────────

        Route::prefix('enrollee')->name('enrollee.')->group(function () {

            Route::get('/dashboard', fn () => Inertia::render('Enrollee/Dashboard'))->name('dashboard');

            // Course browsing + access
            Route::controller(EnrolleeCourseController::class)
                ->prefix('courses')
                ->name('courses.')
                ->group(function () {
                    Route::get('/',                        'index')->name('index');
                    Route::get('/my',                      'myCourses')->name('my');   // if you add this method
                    Route::get('/{course}',                'show')->name('show');
                    Route::post('/{course}/start',         'start')->name('start');
                    Route::post('/{course}/record-payment','recordPayment')->name('record-payment');
                });

            // Lesson progress
            Route::controller(EnrolleeLessonController::class)
                ->prefix('courses/{course}/lessons')
                ->name('courses.lessons.')
                ->group(function () {
                    Route::get( '/{lesson}',               'show')->name('show');
                    Route::post('/{lesson}/complete-video', 'completeVideo')->name('complete-video');
                });

            // Quiz UI demos (static previews — no controller needed)
            Route::prefix('quiz')->name('quiz.')->group(function () {
                Route::get('/drag-and-drop',  fn () => Inertia::render('Enrollee/Courses/QuizDragAndDrop'))->name('drag-and-drop');
                Route::get('/multiple-choice',fn () => Inertia::render('Enrollee/Courses/QuizMultipleChoice'))->name('multiple-choice');
                Route::get('/matching-type',  fn () => Inertia::render('Enrollee/Courses/QuizMatchingType'))->name('matching-type');
                Route::get('/true-or-false',  fn () => Inertia::render('Enrollee/Courses/QuizTrueOrFalse'))->name('true-or-false');
            });
        });

        // ─── Client (B2B / org) ──────────────────────────────────────────────

        Route::prefix('client')->name('client.')->group(function () {
            Route::get('/dashboard',   fn () => Inertia::render('Client/Dashboard'))->name('dashboard');
            Route::get('/library',     fn () => Inertia::render('Client/Library'))->name('library');
            Route::get('/assignments', fn () => Inertia::render('Client/Assignments'))->name('assignments');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | MENTOR — COURSES
    |--------------------------------------------------------------------------
    */

    Route::prefix('courses')->name('mentor.courses.')->group(function () {

        // Core CRUD
        Route::controller(MentorCourseController::class)->group(function () {
            Route::get('/',               'index')->name('index');
            Route::get('/create',         'create')->name('create');
            Route::post('/',              'store')->name('store');
            Route::get('/{course}',       'show')->name('show');
            Route::get('/{course}/edit',  'edit')->name('edit');
            Route::put('/{course}',       'update')->name('update');
            Route::delete('/{course}',    'destroy')->name('destroy');
            Route::post('/{course}/archive', 'archive')->name('archive');   // was softDelete / delete
            Route::post('/{course}/publish', 'publish')->name('publish');
        });

        // Course-builder wizard steps
        Route::prefix('{course}')->group(function () {

            // Syllabus
            Route::get( '/syllabus',      [CourseSyllabusController::class, 'show'])->name('syllabus');
            Route::post('/syllabus/save', [CourseSyllabusController::class, 'save'])->name('syllabus.save');

            // Media content
            Route::get( '/media-content',      [CourseMediaController::class, 'show'])->name('media-content');
            Route::post('/media-content/save', [CourseMediaController::class, 'save'])->name('media-content.save');

            // Pricing
            Route::get( '/pricing',      [CoursePricingController::class, 'show'])->name('pricing');
            Route::post('/pricing/save', [CoursePricingController::class, 'save'])->name('pricing.save');

            // Review
            Route::get('/review', [CourseReviewController::class, 'show'])->name('review');

            // Lesson materials
            Route::post('/lessons/{lesson}/materials', [CourseLessonMaterialController::class, 'store'])->name('lesson-materials.store');
            Route::delete('/materials/{material}',     [CourseLessonMaterialController::class, 'destroy'])->name('lesson-materials.destroy');

            // Lesson videos
            Route::post('/lessons/{lesson}/videos', [CourseLessonVideoController::class, 'store'])->name('lesson-videos.store');
            Route::post('/lessons/video-ticket',    [CourseLessonVideoController::class, 'getUploadTicket'])->name('lesson-videos.ticket');
        });
    });

    // Lesson-video delete lives outside the course prefix (uses only video ID).
    Route::delete('/lesson-videos/{lessonVideo}', [CourseLessonVideoController::class, 'destroy'])
        ->name('mentor.lesson-videos.destroy');

    /*
    |--------------------------------------------------------------------------
    | CERTIFICATES
    |--------------------------------------------------------------------------
    */

    Route::controller(CertificateController::class)
        ->prefix('certificates')
        ->name('certificates.')
        ->group(function () {
            Route::get('/',                'index')->name('index');
            Route::post('/',               'store')->name('store');
            Route::delete('/{certificate}','destroy')->name('destroy');
        });

    /*
    |--------------------------------------------------------------------------
    | ANALYTICS & PAYMENTS (Mentor)
    |--------------------------------------------------------------------------
    */

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/payments',  fn () => Inertia::render('Mentor/Payments/Index'))->name('payments.index');
    Route::get('/enrollees', fn () => Inertia::render('Mentor/Enrollees/Index'))->name('enrollees.index');

    /*
    |--------------------------------------------------------------------------
    | SYLLABUS RESOURCE
    |--------------------------------------------------------------------------
    */

    Route::resource('syllabus', CourseSyllabusController::class);

    /*
    |--------------------------------------------------------------------------
    | VERIFICATION WIZARD
    |--------------------------------------------------------------------------
    */

    Route::prefix('verification')->name('verification.')->group(function () {

        // Step views (protected by step-progress middleware)
        Route::middleware(EnforceVerificationStepProgress::class)->group(function () {
            Route::get('/step-1', [VerificationController::class, 'step1'])->name('step1');
            Route::get('/step-2', [VerificationController::class, 'step2'])->name('step2');
            Route::get('/step-3', [VerificationController::class, 'step3'])->name('step3');
        });

        // Step POST handlers (no middleware — already inside auth group)
        Route::post('/step-1', [VerificationController::class, 'storeStep1'])->name('store1');
        Route::post('/step-2', [VerificationController::class, 'storeStep2'])->name('store2');
        Route::post('/step-3', [VerificationController::class, 'storeStep3'])->name('store3');
    });

});

require __DIR__ . '/auth.php';
